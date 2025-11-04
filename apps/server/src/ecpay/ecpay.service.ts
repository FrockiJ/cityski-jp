import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
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
      const merchantTradeNo = this.generateMerchantTradeNo(request.orderId);

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
   */
  async handlePaymentCallback(
    notification: EcpayCallbackNotification,
  ): Promise<PaymentResult> {
    // 驗證 CheckMacValue
    const receivedCheckMacValue = notification.CheckMacValue;
    const isCheckMacValid = this.cryptoService.verifyCheckMacValue(notification, receivedCheckMacValue);

    if (!isCheckMacValid) {
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

    // 調用已註冊的 callbackUrl（如果有）
    const callbackUrl = this.paymentCallbacks.get(notification.MerchantTradeNo);
    if (callbackUrl) {
      try {
        await this.invokeCallbackUrl(callbackUrl, paymentResult);
      } catch (error) {
        // 不拋出錯誤，因為我們已經驗證了通知
      }
    }
    // 移除已使用的 callback
    this.paymentCallbacks.delete(notification.MerchantTradeNo);

    return paymentResult;
  }

  /**
   * 調用 callback URL
   */
  private async invokeCallbackUrl(
    callbackUrl: string,
    paymentResult: PaymentResult,
  ): Promise<void> {
    try {
      const response = await axios.post(callbackUrl, paymentResult, {
        timeout: 10000, // 10 秒超時
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error(
          `Callback URL returned status ${response.status}`,
        );
      }

      this.logger.log(
        `Callback URL returned: ${response.status}`,
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Callback URL failed: ${error.message} (${error.response?.status || 'no response'})`,
        );
      }
      throw error;
    }
  }

  /**
   * 生成 MerchantTradeNo
   * 格式: ${shortId}${timestamp}（最大 20 字元）
   * 使用時間戳後 10 位 + 隨機數確保唯一性
   */
  private generateMerchantTradeNo(orderId: string): string {
    // Unix timestamp 後 10 位 (足以表示到 2286 年)
    const timestamp = Math.floor(Date.now() / 1000).toString().slice(-10);
    // 4 位隨機數確保唯一性
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    // 組合: 時間戳(10位) + 隨機數(4位) + orderId 縮短版(最多6位)
    const shortOrderId = orderId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).padEnd(6, '0');
    return `${timestamp}${random}${shortOrderId}`.slice(0, 20);
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
