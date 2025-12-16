import { Injectable, Logger } from '@nestjs/common';
import { EcpayConfig } from './ecpay.config';
import { EcpayCryptoService } from './ecpay-crypto.service';
import { TransactionsService } from '../transaction/transactions.service';
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
  ) {}

  /**
   * 初始化信用卡支付
   */
  async initializeCreditCardPayment(
    request: CreditCardPaymentInitializeRequest,
  ): Promise<CreditCardPaymentInitializeResponse> {
    try {
      // 生成 MerchantTradeNo
      const merchantTradeNo = request.orderId;

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
        // 支付成功：更新訂單狀態
        try {
          await this.transactionsService.payDepositByOrderNo(notification.MerchantTradeNo);
          this.logger.log('[CALLBACK STEP 4] ✓ Payment successful - Order payment status updated successfully');
        } catch (error) {
          this.logger.error(`[CALLBACK STEP 4] ✗ Failed to update order status: ${error.message}`);
          this.logger.error(`[CALLBACK STEP 4] Error stack: ${error.stack}`);
          throw error; // 拋出錯誤，讓外層 catch 處理
        }
      } else {
        // 支付失敗：記錄失敗原因，不更新訂單狀態
        this.logger.warn(`[CALLBACK STEP 4] ✗ Payment failed with RtnCode: ${notification.RtnCode}, RtnMsg: ${notification.RtnMsg}`);
        this.logger.warn(`[CALLBACK STEP 4] Order ${notification.MerchantTradeNo} remains in PENDING_DEPOSIT status`);
        this.logger.warn(`[CALLBACK STEP 4] User can retry payment for this order`);

        // 記錄支付失敗到資料庫
        try {
          const failureReason = `RtnCode_${notification.RtnCode}`;
          await this.transactionsService.recordPaymentFailure(notification.MerchantTradeNo, failureReason);
          this.logger.log(`[CALLBACK STEP 4] ✓ Payment failure recorded in database`);
        } catch (error) {
          this.logger.error(`[CALLBACK STEP 4] ✗ Failed to record payment failure: ${error.message}`);
          // 不拋出錯誤，因為這不是關鍵操作
        }
      }

      const redirectUrl = `${this.ecpayConfig.clientDomain}/courses/order-result`;
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
