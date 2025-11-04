import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { EcpayConfig } from './ecpay.config';

@Injectable()
export class EcpayCryptoService {
  constructor(private ecpayConfig: EcpayConfig) {}

  /**
   * 計算 CheckMacValue
   * 按照 ECPay 官方規格：
   * 1. 排除 CheckMacValue，取所有其他參數
   * 2. 按字母順序排序（case-insensitive）
   * 3. 用 & 符號串接
   * 4. 前面加 HashKey，後面加 HashIV
   * 5. 進行 .NET URLEncode（小寫）
   * 6. SHA256 雜湊
   * 7. 轉大寫
   */
  calculateCheckMacValue(params: Record<string, any>): string {
    // 1. 排除 CheckMacValue 本身和不計入檢查碼的欄位
    const filteredParams = { ...params };
    delete filteredParams.CheckMacValue;
    // CustomField 不計入 CheckMacValue 計算
    delete filteredParams.CustomField1;
    delete filteredParams.CustomField2;
    delete filteredParams.CustomField3;
    delete filteredParams.CustomField4;

    // 2. 按字母順序排序（case-insensitive）
    const sortedKeys = Object.keys(filteredParams).sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase()),
    );

    // 3. 構建參數字符串
    const paramParts = [];
    for (const key of sortedKeys) {
      const value = String(filteredParams[key]);
      paramParts.push(`${key}=${value}`);
    }

    // 4. 組合：HashKey & 參數 & HashIV
    const rawString = `HashKey=${this.ecpayConfig.hashKeyPayment}&${paramParts.join('&')}&HashIV=${this.ecpayConfig.hashIvPayment}`;

    // 5. 進行 URL encode 轉換（按照 ECPay .NET URLEncode 規則）
    const encodedString = this.ecpayUrlEncode(rawString);

    // 6. SHA256 雜湊
    const hash = crypto
      .createHash('sha256')
      .update(encodedString)
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
   * ECPay URL Encode - 按照 .NET URLEncode 規則
   * 參考: https://developers.ecpay.com.tw/?p=2904
   *
   * 重要：一次性進行 URL 編碼，處理所有特殊字符和非 ASCII 字符
   * 這樣可以避免重複編碼的問題
   */
  ecpayUrlEncode(str: string): string {
    let result = '';

    // 定義需要編碼的特殊字符集合
    const specialChars = new Set(['~', '+', '@', '#', '$', '&', '=', ';', '?', '/', '\\', '>', '<', '`', '[', ']', '{', '}', ':', "'", '"', ',', '|', '%', ' ']);

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const charCode = char.charCodeAt(0);

      // 普通 ASCII 字母、數字和某些不需要編碼的字符
      // 這些字符是 ASCII 範圍內且不在特殊字符集合中的
      if (charCode >= 0x20 && charCode <= 0x7e && !specialChars.has(char)) {
        result += char;
      } else if (charCode < 128) {
        // ASCII 特殊字符，進行編碼
        if (char === '~') result += '%7e';
        else if (char === '+') result += '%2b';
        else if (char === '@') result += '%40';
        else if (char === '#') result += '%23';
        else if (char === '$') result += '%24';
        else if (char === '&') result += '%26';
        else if (char === '=') result += '%3d';
        else if (char === ';') result += '%3b';
        else if (char === '?') result += '%3f';
        else if (char === '/') result += '%2f';
        else if (char === '\\') result += '%5c';
        else if (char === '>') result += '%3e';
        else if (char === '<') result += '%3c';
        else if (char === '`') result += '%60';
        else if (char === '[') result += '%5b';
        else if (char === ']') result += '%5d';
        else if (char === '{') result += '%7b';
        else if (char === '}') result += '%7d';
        else if (char === ':') result += '%3a';
        else if (char === "'") result += '%27';
        else if (char === '"') result += '%22';
        else if (char === ',') result += '%2c';
        else if (char === '|') result += '%7c';
        else if (char === '%') result += '%25';
        else if (char === ' ') result += '+';
        else result += char;
      } else {
        // 非 ASCII 字符（如中文），轉為 UTF-8 字節後進行百分比編碼
        const utf8Bytes = Buffer.from(char, 'utf8');
        for (const byte of utf8Bytes) {
          result += '%' + byte.toString(16).padStart(2, '0');
        }
      }
    }

    // 轉小寫
    return result.toLowerCase();
  }
}
