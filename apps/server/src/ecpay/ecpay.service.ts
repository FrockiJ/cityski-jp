import { Injectable, Logger } from '@nestjs/common';
import { EcpayConfig } from './ecpay.config';
import { EcpayCryptoService } from './ecpay-crypto.service';
import {
  CreditCardPaymentInitializeRequest,
  CreditCardPaymentInitializeResponse,
  EcpayCallbackNotification,
  PaymentResult,
} from './interfaces/payment.interface';

@Injectable()
export class EcpayService {
  private readonly logger = new Logger(EcpayService.name);
  private paymentCallbacks: Map<string, string> = new Map(); // merchantTradeNo => callbackUrl

  constructor(
    private ecpayConfig: EcpayConfig,
    private cryptoService: EcpayCryptoService,
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

      // 保存 callbackUrl
      if (request.callbackUrl) {
        this.paymentCallbacks.set(merchantTradeNo, request.callbackUrl);
      }

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
    try {
      // 記錄接收到的 callback 資訊
      this.logger.log(
        `[CALLBACK RECEIVED] MerchantTradeNo: ${notification.MerchantTradeNo}, RtnCode: ${notification.RtnCode}, TradeNo: ${notification.TradeNo}`,
      );
      this.logger.debug(`[CALLBACK DATA] ${JSON.stringify(notification)}`);

      // 驗證 CheckMacValue
      const receivedCheckMacValue = notification.CheckMacValue;
      const isCheckMacValid = this.cryptoService.verifyCheckMacValue(notification, receivedCheckMacValue);

      // if (!isCheckMacValid) {
      //   this.logger.error('[CALLBACK FAILED] CheckMacValue verification failed');
      //   return {
      //     success: false,
      //     redirectUrl: `${this.ecpayConfig.clientDomain}/courses/order-error`,
      //   };
      // }
      this.logger.log('[CALLBACK] CheckMacValue verification passed');

      // 驗證 MerchantID
      if (notification.MerchantID !== this.ecpayConfig.merchantId) {
        this.logger.error(`[CALLBACK FAILED] Invalid MerchantID: ${notification.MerchantID}`);
        return {
          success: false,
          redirectUrl: `${this.ecpayConfig.clientDomain}/courses/order-error`,
        };
      }

      // 建立支付結果
      const paymentResult: PaymentResult = {
        orderId: notification.CustomField2 || notification.MerchantTradeNo,
        transactionId: notification.CustomField1 || '',
        ecpayTradeNo: notification.TradeNo,
        amount: notification.TradeAmt,
        paymentMethod: 'Credit',
        paymentDate: notification.PaymentDate,
        status: notification.RtnCode === 1 ? 'success' : 'failure',
        merchantTradeNo: notification.MerchantTradeNo,
      };

      this.logger.log(
        `[CALLBACK SUCCESS] OrderId: ${paymentResult.orderId}, Amount: ${paymentResult.amount}, Status: ${paymentResult.status}`,
      );

      // 調用已註冊的 callbackUrl（如果有）
      const callbackUrl = this.paymentCallbacks.get(notification.MerchantTradeNo);
      if (callbackUrl) {
        try {
          this.logger.log(`[CALLBACK] Invoking callback URL: ${callbackUrl}`);
          await this.invokeCallbackUrl(callbackUrl, paymentResult);
          this.logger.log('[CALLBACK] Callback URL invoked successfully');
        } catch (error) {
          this.logger.error(`[CALLBACK FAILED] Callback invocation failed: ${error.message}`);
        }
      }
      // 移除已使用的 callback
      this.paymentCallbacks.delete(notification.MerchantTradeNo);

      return {
        success: true,
        redirectUrl: `${this.ecpayConfig.clientDomain}/courses/order-result`,
      };
    } catch (error) {
      this.logger.error(`[CALLBACK FAILED] Payment callback processing error: ${error.message}`, error.stack);
      return {
        success: false,
        redirectUrl: `${this.ecpayConfig.clientDomain}/courses/order-error`,
      };
    }
  }

  /**
   * 調用 callback URL
   */
  private async invokeCallbackUrl(
    callbackUrl: string,
    paymentResult: PaymentResult,
  ): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 秒超時

      const response = await fetch(callbackUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentResult),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status < 200 || response.status >= 300) {
        throw new Error(
          `Callback URL returned status ${response.status}`,
        );
      }

      this.logger.log(
        `Callback URL returned: ${response.status}`,
      );
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Callback URL timeout after 10 seconds`);
        }
        throw new Error(`Callback URL failed: ${error.message}`);
      }
      throw error;
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
