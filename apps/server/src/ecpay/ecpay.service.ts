import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EcpayConfig } from './ecpay.config';
import { EcpayCryptoService } from './ecpay-crypto.service';
import { TransactionsService } from '../transaction/transactions.service';
import { Order } from '../orders/entities/order.entity';
import {
  CreditCardPaymentInitializeRequest,
  CreditCardPaymentInitializeResponse,
  EcpayCallbackNotification,
  PaymentResult,
} from './interfaces/payment.interface';

@Injectable()
export class EcpayService {
  private readonly logger = new Logger(EcpayService.name);

  constructor(
    private ecpayConfig: EcpayConfig,
    private cryptoService: EcpayCryptoService,
    private transactionsService: TransactionsService,
    @InjectRepository(Order)
    private ordersRepo: Repository<Order>,
  ) {}

  /**
   * 初始化信用卡支付
   * @param request 支付請求
   * @param transactionStatus 交易狀態 (0: 訂金, 2: 尾款)
   */
  async initializeCreditCardPayment(
    request: CreditCardPaymentInitializeRequest,
    transactionStatus: number,
  ): Promise<CreditCardPaymentInitializeResponse> {
    try {
      // 生成唯一的 MerchantTradeNo
      // 訂金: 使用原始訂單號
      // 尾款: 在訂單號後加上 B 後綴 + 時間戳（秒）以避免重複 (B = Balance)
      // 注意：綠界要求 MerchantTradeNo 只能包含數字和英文字母，不能有特殊字符
      // 注意：MerchantTradeNo 最大長度為 20 字元
      let merchantTradeNo = request.orderId;
      if (transactionStatus === 2) {
        // PENDING_FULL_PAYMENT: 尾款支付
        // 加入當前時間戳的後 4 位數（秒級），確保每次重試都是唯一的
        // 15 字元訂單號 + 1 字元 B + 4 字元時間戳 = 20 字元（符合 ECPay 限制）
        const timestamp = Math.floor(Date.now() / 1000).toString().slice(-4);
        merchantTradeNo = `${request.orderId}B${timestamp}`;
        this.logger.log(`Generating balance payment MerchantTradeNo: ${merchantTradeNo}`);
      } else {
        this.logger.log(`Generating deposit payment MerchantTradeNo: ${merchantTradeNo}`);
      }

      // 準備支付參數
      // 注意：所有參數值都必須是字符串類型以確保 CheckMacValue 計算正確
      const paymentParams = {
        MerchantID: String(this.ecpayConfig.merchantId),
        MerchantTradeNo: merchantTradeNo,
        MerchantTradeDate: this.getCurrentTradeDate(),
        PaymentType: 'aio',
        TotalAmount: String(request.amount),
        TradeDesc: `Order`,
        ItemName: `Payment`,
        ReturnURL: this.ecpayConfig.returnUrl,
        //OrderResultURL: this.ecpayConfig.orderResultUrl,
        ChoosePayment: 'Credit',
        EncryptType: '1',
      };

      // 計算 CheckMacValue
      paymentParams['CheckMacValue'] = this.cryptoService.calculateCheckMacValue(
        paymentParams,
      );

      // 生成表單 HTML
      const formHtml = this.generateFormHtml(paymentParams);

      return {
        success: true,
        formHtml,
        merchantTradeNo,
      };
    } catch (error) {
      this.logger.error(`Failed to initialize payment: ${error.message}`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 處理 ECPay 回調通知
   * 返回: { success: boolean, redirectUrl?: string }
   */
  async handlePaymentCallback(
    notification: EcpayCallbackNotification,
  ): Promise<{ success: boolean; redirectUrl?: string }> {
    this.logger.log('========================================');
    this.logger.log('[CALLBACK START] Processing ECPay payment callback');
    this.logger.log('========================================');

    try {
      // 記錄接收到的 callback 資訊
      this.logger.log(
        `[CALLBACK RECEIVED] MerchantTradeNo: ${notification.MerchantTradeNo}, RtnCode: ${notification.RtnCode}, TradeNo: ${notification.TradeNo}`,
      );
      this.logger.debug(`[CALLBACK DATA] Full notification: ${JSON.stringify(notification)}`);

      // 驗證 CheckMacValue
      this.logger.log('[CALLBACK STEP 1] Verifying CheckMacValue...');
      const receivedCheckMacValue = notification.CheckMacValue;
      const isCheckMacValid = this.cryptoService.verifyCheckMacValue(notification, receivedCheckMacValue);

      // TODO:
      // if (!isCheckMacValid) {
      //   this.logger.error('[CALLBACK FAILED] CheckMacValue verification failed');
      //   return {
      //     success: false,
      //     redirectUrl: `${this.ecpayConfig.clientDomain}/courses/order-error`,
      //   };
      // }
      // this.logger.log('[CALLBACK STEP 1] ✓ CheckMacValue verification passed');

      // 驗證 MerchantID
      this.logger.log(`[CALLBACK STEP 2] Verifying MerchantID (Expected: ${this.ecpayConfig.merchantId}, Received: ${notification.MerchantID})`);
      if (notification.MerchantID !== this.ecpayConfig.merchantId) {
        this.logger.error(`[CALLBACK FAILED] Invalid MerchantID: ${notification.MerchantID}`);
        return {
          success: false,
          redirectUrl: `${this.ecpayConfig.clientDomain}/courses/order-error`,
        };
      }
      this.logger.log('[CALLBACK STEP 2] ✓ MerchantID verification passed');

      // 建立支付結果
      this.logger.log('[CALLBACK STEP 3] Building payment result object...');
      this.logger.log(`[CALLBACK STEP 3] RtnCode type: ${typeof notification.RtnCode}, value: ${notification.RtnCode}`);

      const paymentResult: PaymentResult = {
        orderId: notification.CustomField2 || notification.MerchantTradeNo,
        transactionId: notification.CustomField1 || '',
        ecpayTradeNo: notification.TradeNo,
        amount: notification.TradeAmt,
        paymentMethod: 'Credit',
        paymentDate: notification.PaymentDate,
        status: Number(notification.RtnCode) === 1 ? 'success' : 'failure',
        merchantTradeNo: notification.MerchantTradeNo,
      };

      this.logger.log(
        `[CALLBACK STEP 3] ✓ Payment result built - OrderId: ${paymentResult.orderId}, Amount: ${paymentResult.amount}, Status: ${paymentResult.status}`,
      );
      this.logger.log(`[CALLBACK STEP 3] Payment result details: ${JSON.stringify(paymentResult)}`);

      // 根據 RtnCode 決定是否更新訂單狀態
      this.logger.log('[CALLBACK STEP 4] Processing payment result based on RtnCode...');
      if (Number(notification.RtnCode) === 1) {
        // 支付成功：智能路由訂金/尾款支付
        try {
          // 從 MerchantTradeNo 提取原始訂單號
          // 訂金: P21202512160137
          // 尾款: P21202512160137B1234 (B + 4位時間戳)
          let orderNo = notification.MerchantTradeNo;
          // 如果包含 B，則移除 B 及其後面的時間戳
          const bIndex = notification.MerchantTradeNo.indexOf('B');
          if (bIndex !== -1) {
            orderNo = notification.MerchantTradeNo.substring(0, bIndex);
          }
          this.logger.log(`[CALLBACK STEP 4] Extracted order number: ${orderNo} from MerchantTradeNo: ${notification.MerchantTradeNo}`);

          // 查詢訂單以獲取交易狀態
          const order = await this.ordersRepo.findOne({
            where: { no: orderNo },
            relations: ['transaction'],
          });

          if (!order || !order.transaction) {
            this.logger.error(`[CALLBACK STEP 4] ✗ Order or transaction not found: ${orderNo}`);
            throw new Error('Order or transaction not found');
          }

          const transactionStatus = order.transaction.status;
          this.logger.log(`[CALLBACK STEP 4] Current transaction status: ${transactionStatus}`);

          if (transactionStatus === 0) {
            // TransactionStatus.PENDING_DEPOSIT: 訂金支付
            this.logger.log('[CALLBACK STEP 4] Routing to deposit payment handler...');
            // 信用卡支付，傳遞 'CREDIT' 作為付款方式
            await this.transactionsService.payDepositByOrderNo(orderNo, 'CREDIT');
            this.logger.log('[CALLBACK STEP 4] ✓ Deposit payment successful - Order status updated');
          } else if (transactionStatus === 2) {
            // TransactionStatus.PENDING_FULL_PAYMENT: 尾款支付
            this.logger.log('[CALLBACK STEP 4] Routing to balance payment handler...');
            await this.transactionsService.payBalanceByOrderNo(orderNo);
            this.logger.log('[CALLBACK STEP 4] ✓ Balance payment successful - Order completed');
          } else {
            this.logger.warn(`[CALLBACK STEP 4] ⚠ Unexpected transaction status: ${transactionStatus}`);
            throw new Error(`Unexpected transaction status: ${transactionStatus}`);
          }
        } catch (error) {
          this.logger.error(`[CALLBACK STEP 4] ✗ Failed to update order status: ${error.message}`);
          this.logger.error(`[CALLBACK STEP 4] Error stack: ${error.stack}`);
          throw error; // 拋出錯誤，讓外層 catch 處理
        }
      } else {
        // 支付失敗：根據支付類型處理
        this.logger.warn(`[CALLBACK STEP 4] ✗ Payment failed with RtnCode: ${notification.RtnCode}, RtnMsg: ${notification.RtnMsg}`);

        try {
          // 從 MerchantTradeNo 提取原始訂單號並判斷支付類型
          // 訂金: P21202512160137
          // 尾款: P21202512160137B1234 (B + 4位時間戳)
          let orderNo = notification.MerchantTradeNo;
          const bIndex = notification.MerchantTradeNo.indexOf('B');
          const isBalancePayment = bIndex !== -1;

          if (isBalancePayment) {
            orderNo = notification.MerchantTradeNo.substring(0, bIndex);
          }

          // 限制失敗原因長度為 20 字元
          const failureReason = `RtnCode_${notification.RtnCode}`.substring(0, 20);

          if (isBalancePayment) {
            // 尾款支付失敗：只記錄失敗，不取消訂單，允許重新支付
            this.logger.warn(`[CALLBACK STEP 4] Balance payment failed for order ${orderNo}, recording failure (order will not be cancelled)`);
            await this.transactionsService.recordBalancePaymentFailure(orderNo, failureReason);
            this.logger.log(`[CALLBACK STEP 4] ✓ Balance payment failure recorded`);
          } else {
            // 訂金支付失敗：取消訂單
            this.logger.warn(`[CALLBACK STEP 4] Deposit payment failed, cancelling order ${orderNo}`);
            await this.transactionsService.cancelOrderByOrderNo(orderNo, failureReason);
            this.logger.log(`[CALLBACK STEP 4] ✓ Order cancelled successfully`);
          }
        } catch (error) {
          this.logger.error(`[CALLBACK STEP 4] ✗ Failed to handle payment failure: ${error.message}`);
          // 不拋出錯誤，讓流程繼續
        }
      }

      // 根據處理結果決定重定向 URL
      let redirectUrl: string;

      if (Number(notification.RtnCode) === 1) {
        // 支付成功：導向支付成功頁面
        redirectUrl = `${this.ecpayConfig.clientDomain}/courses/payment-success`;
      } else {
        // 支付失敗：導向錯誤頁面
        // 從 MerchantTradeNo 判斷是否為尾款支付
        const isBalancePayment = notification.MerchantTradeNo.indexOf('B') !== -1;

        if (isBalancePayment) {
          // 尾款支付失敗：導向錯誤頁面並帶上 balance_payment_failed 參數
          redirectUrl = `${this.ecpayConfig.clientDomain}/courses/order-error?reason=balance_payment_failed`;
        } else {
          // 訂金支付失敗：導向一般錯誤頁面
          redirectUrl = `${this.ecpayConfig.clientDomain}/courses/order-error?reason=payment_failed`;
        }
      }

      this.logger.log(`[CALLBACK SUCCESS] Payment callback processed successfully. Redirect URL: ${redirectUrl}`);
      this.logger.log('========================================');
      this.logger.log('[CALLBACK END] ECPay payment callback completed');
      this.logger.log('========================================');

      return {
        success: true,
        redirectUrl,
      };
    } catch (error) {
      this.logger.error('========================================');
      this.logger.error(`[CALLBACK FAILED] Payment callback processing error: ${error.message}`);
      this.logger.error(`[CALLBACK FAILED] Error stack: ${error.stack}`);
      this.logger.error('========================================');
      return {
        success: false,
        redirectUrl: `${this.ecpayConfig.clientDomain}/courses/order-error`,
      };
    }
  }


  /**
   * 取得當前時間戳，格式: yyyy/MM/dd HH:mm:ss
   */
  private getCurrentTradeDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * 生成 ECPay 付款表單 HTML
   */
  private generateFormHtml(params: Record<string, any>): string {
    const apiUrl = this.ecpayConfig.getApiUrl();

    // 構建表單欄位
    const fields = Object.keys(params)
      .map(
        (key) =>
          `<input type="hidden" name="${key}" value="${this.escapeHtml(String(params[key]))}">`,
      )
      .join('\n');

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Payment Processing</title>
</head>
<body onload="document.paymentForm.submit();">
  <form id="paymentForm" name="paymentForm" method="POST" action="${apiUrl}">
    ${fields}
  </form>
  <p>Redirecting to payment gateway...</p>
</body>
</html>
    `;

    return html.trim();
  }

  /**
   * 轉義 HTML 特殊字符
   */
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}
