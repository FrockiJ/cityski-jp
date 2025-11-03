import { Injectable, Logger } from '@nestjs/common';
import { EcpayConfig } from './ecpay.config';
import { EcpayCryptoService } from './ecpay-crypto.service';
import {
  CreditCardPaymentInitializeRequest,
  CreditCardPaymentInitializeResponse,
  EcpayCallbackNotification,
  PaymentResult,
  PaymentCallback,
} from './interfaces/payment.interface';

@Injectable()
export class EcpayService {
  private readonly logger = new Logger(EcpayService.name);
  private paymentCallbacks: Map<string, PaymentCallback> = new Map();

  constructor(
    private ecpayConfig: EcpayConfig,
    private cryptoService: EcpayCryptoService,
  ) {}

  /**
   * 初始化信用卡支付
   */
  async initializeCreditCardPayment(
    request: CreditCardPaymentInitializeRequest,
    transactionId: string,
  ): Promise<CreditCardPaymentInitializeResponse> {
    try {
      // 生成 MerchantTradeNo
      const merchantTradeNo = this.generateMerchantTradeNo(request.orderId);

      // 準備支付參數
      const paymentParams = {
        MerchantID: this.ecpayConfig.merchantId,
        MerchantTradeNo: merchantTradeNo,
        MerchantTradeDate: this.getCurrentTradeDate(),
        PaymentType: 'aio',
        TotalAmount: request.amount,
        TradeDesc: `Order #${request.orderId}`,
        ItemName: `Course Payment - Order #${request.orderId}`,
        ReturnURL: this.ecpayConfig.returnUrl,
        ChoosePayment: 'Credit',
        EncryptType: 1,
        // 自定義欄位用於追蹤交易
        CustomField1: transactionId,
        CustomField2: request.orderId,
      };

      // 計算 CheckMacValue
      paymentParams['CheckMacValue'] = this.cryptoService.calculateCheckMacValue(
        paymentParams,
      );

      // 生成表單 HTML
      const formHtml = this.generateFormHtml(paymentParams);

      this.logger.log(
        `Payment initialized: orderId=${request.orderId}, merchantTradeNo=${merchantTradeNo}`,
      );

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
   */
  async handlePaymentCallback(
    notification: EcpayCallbackNotification,
  ): Promise<PaymentResult> {
    this.logger.log(
      `Received payment callback: MerchantTradeNo=${notification.MerchantTradeNo}`,
    );

    // 驗證 CheckMacValue
    if (!this.cryptoService.verifyCheckMacValue(notification, notification.CheckMacValue)) {
      throw new Error('CheckMacValue verification failed');
    }

    // 驗證 MerchantID
    if (notification.MerchantID !== this.ecpayConfig.merchantId) {
      throw new Error('Invalid MerchantID');
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

    // 執行已註冊的 callback（如果有）
    const callback = this.paymentCallbacks.get(paymentResult.orderId);
    if (callback) {
      try {
        await callback(paymentResult);
        this.logger.log(
          `Callback executed successfully for orderId=${paymentResult.orderId}`,
        );
      } catch (error) {
        this.logger.error(
          `Callback execution failed for orderId=${paymentResult.orderId}: ${error.message}`,
          error,
        );
        // 不拋出錯誤，因為我們已經驗證了通知
      }
    }

    return paymentResult;
  }

  /**
   * 註冊支付完成的 callback
   */
  registerPaymentCallback(
    orderId: string,
    callback: PaymentCallback,
  ): void {
    this.paymentCallbacks.set(orderId, callback);
    this.logger.log(`Payment callback registered for orderId=${orderId}`);
  }

  /**
   * 移除支付 callback
   */
  removePaymentCallback(orderId: string): void {
    this.paymentCallbacks.delete(orderId);
  }

  /**
   * 生成 MerchantTradeNo
   * 格式: ${orderId}_${Unix時間戳}
   */
  private generateMerchantTradeNo(orderId: string): string {
    const timestamp = Math.floor(Date.now() / 1000);
    return `${orderId}_${timestamp}`;
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
