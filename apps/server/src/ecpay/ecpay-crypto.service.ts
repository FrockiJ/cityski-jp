import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { EcpayConfig } from './ecpay.config';

@Injectable()
export class EcpayCryptoService {
  constructor(private ecpayConfig: EcpayConfig) {}

  /**
   * 計算 CheckMacValue
   * 按照 ECPay 規格：
   * 1. 排除 CheckMacValue，取所有其他參數
   * 2. 按字母順序排序
   * 3. 用 & 符號串接
   * 4. 前面加 HashKey，後面加 HashIV
   * 5. URL encode 轉小寫
   * 6. SHA256 雜湊
   * 7. 轉大寫
   */
  calculateCheckMacValue(params: Record<string, any>): string {
    // 1. 排除 CheckMacValue 本身
    const filteredParams = { ...params };
    delete filteredParams.CheckMacValue;

    // 2. 按字母順序排序參數
    const sortedKeys = Object.keys(filteredParams).sort();

    // 3. 用 & 符號串接參數
    const paramString = sortedKeys
      .map((key) => `${key}=${filteredParams[key]}`)
      .join('&');

    // 4. 前面加 HashKey，後面加 HashIV
    const rawString = `HashKey=${this.ecpayConfig.hashKeyPayment}&${paramString}&HashIV=${this.ecpayConfig.hashIvPayment}`;

    // 5. URL encode 並轉小寫
    const urlEncodedString = this.urlEncode(rawString).toLowerCase();

    // 6. SHA256 雜湊
    const hash = crypto
      .createHash('sha256')
      .update(urlEncodedString)
      .digest('hex');

    // 7. 轉大寫
    return hash.toUpperCase();
  }

  /**
   * 驗證 CheckMacValue
   */
  verifyCheckMacValue(
    params: Record<string, any>,
    receivedCheckMacValue: string,
  ): boolean {
    const calculatedCheckMacValue = this.calculateCheckMacValue(params);
    return calculatedCheckMacValue === receivedCheckMacValue;
  }

  /**
   * URL Encode - 按照 ECPay 規格
   * 遵循 RFC 1866 編碼規則
   */
  private urlEncode(str: string): string {
    return encodeURIComponent(str)
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A');
  }
}
