import {
  Controller,
  Get,
  Post,
  Body,
  Logger,
  BadRequestException,
  Res,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { EcpayService } from './ecpay.service';
import { EcpayConfig } from './ecpay.config';
import { EcpayCryptoService } from './ecpay-crypto.service';

/**
 * ECPay 測試控制器
 * 提供網頁介面進行 ECPay 支付功能測試
 *
 * 註：僅用於開發和測試環境，生產環境應移除此控制器
 */
@Controller('test/ecpay')
export class EcpayTestController {
  private readonly logger = new Logger(EcpayTestController.name);

  constructor(
    private ecpayService: EcpayService,
    private ecpayConfig: EcpayConfig,
    private cryptoService: EcpayCryptoService,
  ) {}

  /**
   * 獲取測試頁面
   * GET /test/ecpay
   */
  @Get()
  getTestPage(@Res() res: Response) {
    const html = this.generateTestPageHtml();
    res.type('text/html').send(html);
  }

  /**
   * 測試支付初始化 API
   * POST /test/ecpay/api/initialize
   */
  @Post('api/initialize')
  async testInitialize(
    @Body() body: { orderId: string; amount: number },
  ) {
    try {
      this.logger.log(
        `[TEST] Initializing payment: orderId=${body.orderId}, amount=${body.amount}`,
      );

      // 驗證參數
      if (!body.orderId || !body.amount || body.amount <= 0) {
        throw new BadRequestException('Invalid orderId or amount');
      }

      // 調用支付初始化服務
      const result = await this.ecpayService.initializeCreditCardPayment({
        orderId: body.orderId,
        amount: body.amount,
      });

      return {
        success: true,
        data: {
          ...result,
          testInfo: {
            environment: this.ecpayConfig.environment,
            merchantId: this.ecpayConfig.merchantId,
            timestamp: new Date().toISOString(),
          },
        },
      };
    } catch (error) {
      this.logger.error(`[TEST] Initialize failed: ${error.message}`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 模擬 ECPay 回調通知
   * POST /test/ecpay/api/simulate-callback
   */
  @Post('api/simulate-callback')
  async simulateCallback(
    @Body()
    body: {
      merchantTradeNo: string;
      amount: number;
      rtnCode?: number;
      tradeNo?: string;
    },
  ) {
    try {
      const rtnCode = body.rtnCode || 1; // 1 = 成功
      const tradeNo = body.tradeNo || `ECPay_${Date.now()}`;

      this.logger.log(
        `[TEST] Simulating callback: merchantTradeNo=${body.merchantTradeNo}, rtnCode=${rtnCode}`,
      );

      // 構造回調數據
      const callbackData: any = {
        MerchantID: this.ecpayConfig.merchantId,
        MerchantTradeNo: body.merchantTradeNo,
        PaymentType: 'aio',
        RtnCode: rtnCode,
        RtnMsg: rtnCode === 1 ? '成功' : '失敗',
        TradeNo: tradeNo,
        TradeAmt: body.amount,
        PaymentDate: new Date().toISOString(),
        PaymentMethod: 'Credit',
        CardSix: '411111',
        CardFour: '1111',
        SimulatePaid: 1,
        PaymentTypeChargeFee: 0,
        TradeStatus: rtnCode === 1 ? 1 : 0,
      };

      // 計算 CheckMacValue
      const checkMacValue = this.cryptoService.calculateCheckMacValue(
        callbackData,
      );
      callbackData['CheckMacValue'] = checkMacValue;

      // 調用回調處理
      const result = await this.ecpayService.handlePaymentCallback(
        callbackData,
      );

      return {
        success: true,
        data: {
          callbackData,
          checkMacValue,
          result,
        },
      };
    } catch (error) {
      this.logger.error(
        `[TEST] Simulate callback failed: ${error.message}`,
        error,
      );
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 驗證 CheckMacValue
   * POST /test/ecpay/api/verify-checkmac
   */
  @Post('api/verify-checkmac')
  async verifyCheckMac(
    @Body()
    body: {
      data: Record<string, any>;
      checkMacValue: string;
    },
  ) {
    try {
      const isValid = this.cryptoService.verifyCheckMacValue(
        body.data,
        body.checkMacValue,
      );

      // 計算期望的 CheckMacValue 用於調試
      const calculatedCheckMacValue = this.cryptoService.calculateCheckMacValue(body.data);

      return {
        success: true,
        data: {
          isValid,
          message: isValid
            ? 'CheckMacValue 驗證成功'
            : 'CheckMacValue 驗證失敗',
          received: body.checkMacValue,
          calculated: calculatedCheckMacValue,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 計算 CheckMacValue 調試端點
   * POST /test/ecpay/api/calculate-checkmac
   */
  @Post('api/calculate-checkmac')
  async calculateCheckMacDebug(
    @Body() params: Record<string, any>,
  ) {
    try {
      const calculatedCheckMacValue = this.cryptoService.calculateCheckMacValue(params);

      this.logger.log(`[DEBUG] Calculated CheckMacValue: ${calculatedCheckMacValue}`);

      return {
        success: true,
        data: {
          checkMacValue: calculatedCheckMacValue,
          params,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 從原始字符串計算 CheckMacValue（ECPay 格式）並顯示詳細步驟
   * POST /test/ecpay/api/calculate-checkmac-from-string
   *
   * Body:
   * {
   *   "paramString": "TradeDesc=促銷方案&PaymentType=aio&MerchantTradeDate=2023/03/12 15:30:23&..."
   * }
   */
  @Post('api/calculate-checkmac-from-string')
  async calculateCheckMacFromString(
    @Body() body: { paramString: string },
  ) {
    try {
      if (!body.paramString) {
        throw new Error('paramString is required');
      }

      // 解析參數字符串為對象
      const params: Record<string, string> = {};
      const pairs = body.paramString.split('&');

      for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key && value !== undefined) {
          try {
            params[key] = decodeURIComponent(value);
          } catch {
            params[key] = value;
          }
        }
      }

      // 步驟 1: 按字母順序排序參數
      const filteredParams = { ...params };
      delete filteredParams.CheckMacValue;
      delete filteredParams.CustomField1;
      delete filteredParams.CustomField2;
      delete filteredParams.CustomField3;
      delete filteredParams.CustomField4;

      const sortedKeys = Object.keys(filteredParams).sort((a, b) =>
        a.toLowerCase().localeCompare(b.toLowerCase()),
      );

      // 步驟 2: 用 & 串接排序後的參數
      const paramParts = [];
      for (const key of sortedKeys) {
        const value = String(filteredParams[key]);
        paramParts.push(`${key}=${value}`);
      }
      const step1_sortedParams = paramParts.join('&');

      // 步驟 2: 前面加 HashKey，後面加 HashIV
      const step2_withHashKeyIV = `HashKey=${this.ecpayConfig.hashKeyPayment}&${step1_sortedParams}&HashIV=${this.ecpayConfig.hashIvPayment}`;

      // 步驟 3: URL encode
      const step3_urlEncoded = this.cryptoService.ecpayUrlEncode(step2_withHashKeyIV);

      // 步驟 4: 轉小寫（已在 ecpayUrlEncode 中完成）
      const step4_lowercase = step3_urlEncoded; // 已經是小寫

      // 步驟 5: SHA256 加密
      const crypto = require('crypto');
      const step5_sha256 = crypto
        .createHash('sha256')
        .update(step4_lowercase)
        .digest('hex');

      // 步驟 6: 轉大寫產生 CheckMacValue
      const step6_checkMacValue = step5_sha256.toUpperCase();

      return {
        success: true,
        data: {
          steps: {
            step1_sortedParams: {
              description: '步驟 1: 將參數按字母順序排序，並用 & 串接',
              result: step1_sortedParams,
            },
            step2_withHashKeyIV: {
              description: '步驟 2: 最前面加 HashKey，最後面加 HashIV',
              result: step2_withHashKeyIV,
            },
            step3_urlEncoded: {
              description: '步驟 3: 進行 URL encode',
              result: step3_urlEncoded,
            },
            step4_lowercase: {
              description: '步驟 4: 轉為小寫',
              result: step4_lowercase,
            },
            step5_sha256: {
              description: '步驟 5: 進行 SHA256 加密',
              result: step5_sha256,
            },
            step6_checkMacValue: {
              description: '步驟 6: 轉大寫產生 CheckMacValue',
              result: step6_checkMacValue,
            },
          },
          checkMacValue: step6_checkMacValue,
          parsedParams: params,
          sortedParams: sortedKeys.reduce(
            (acc, key) => {
              acc[key] = filteredParams[key];
              return acc;
            },
            {} as Record<string, string>,
          ),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 從原始字符串驗證 CheckMacValue
   * POST /test/ecpay/api/verify-checkmac-from-string
   *
   * Body:
   * {
   *   "paramString": "TradeDesc=促銷方案&PaymentType=aio&...",
   *   "checkMacValue": "ABCD1234..."
   * }
   */
  @Post('api/verify-checkmac-from-string')
  async verifyCheckMacFromString(
    @Body() body: { paramString: string; checkMacValue: string },
  ) {
    try {
      if (!body.paramString || !body.checkMacValue) {
        throw new Error('paramString and checkMacValue are required');
      }

      // 解析參數字符串為對象
      const params: Record<string, string> = {};
      const pairs = body.paramString.split('&');

      for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key && value !== undefined) {
          try {
            params[key] = decodeURIComponent(value);
          } catch {
            params[key] = value;
          }
        }
      }

      // 計算並驗證 CheckMacValue
      const calculatedCheckMacValue = this.cryptoService.calculateCheckMacValue(params);
      const isValid = calculatedCheckMacValue === body.checkMacValue;

      return {
        success: true,
        data: {
          isValid,
          message: isValid ? 'CheckMacValue 驗證成功' : 'CheckMacValue 驗證失敗',
          received: body.checkMacValue,
          calculated: calculatedCheckMacValue,
          parsedParams: params,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 獲取測試配置
   * GET /test/ecpay/api/config
   */
  @Get('api/config')
  getTestConfig() {
    return {
      merchantId: this.ecpayConfig.merchantId,
      environment: this.ecpayConfig.environment,
      apiUrl: this.ecpayConfig.getApiUrl(),
      returnUrl: this.ecpayConfig.returnUrl,
    };
  }

  /**
   * 生成測試頁面 HTML
   */
  private generateTestPageHtml(): string {
    return `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ECPay 支付測試工具</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      background: white;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .header h1 {
      color: #333;
      margin-bottom: 10px;
    }

    .header p {
      color: #666;
      font-size: 14px;
    }

    .config-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }

    .config-item {
      padding: 10px;
      background: #f5f5f5;
      border-radius: 4px;
      font-size: 13px;
    }

    .config-item strong {
      display: block;
      color: #666;
      margin-bottom: 5px;
    }

    .config-item code {
      color: #e74c3c;
      font-size: 12px;
    }

    .main {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
    }

    .card {
      background: white;
      border-radius: 8px;
      padding: 25px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .card h2 {
      color: #333;
      margin-bottom: 20px;
      font-size: 18px;
      border-bottom: 2px solid #667eea;
      padding-bottom: 10px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      color: #666;
      font-size: 14px;
      margin-bottom: 5px;
      font-weight: 500;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .button-group {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    .btn {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5568d3;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }

    .btn-secondary {
      background: #ecf0f1;
      color: #333;
    }

    .btn-secondary:hover {
      background: #d5dbdb;
    }

    .result {
      margin-top: 20px;
      padding: 15px;
      border-radius: 4px;
      font-size: 13px;
      display: none;
    }

    .result.success {
      display: block;
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .result.error {
      display: block;
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .result pre {
      margin-top: 10px;
      background: white;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 12px;
    }

    .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid #f3f3f3;
      border-top: 2px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .form-html {
      margin-top: 20px;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 4px;
      max-height: 300px;
      overflow-y: auto;
    }

    .form-html code {
      font-size: 12px;
      color: #333;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .tab-buttons {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      border-bottom: 2px solid #eee;
    }

    .tab-btn {
      padding: 10px 15px;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      color: #666;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .tab-btn.active {
      color: #667eea;
      border-bottom-color: #667eea;
    }

    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
    }

    .test-card-list {
      list-style: none;
      margin-top: 15px;
    }

    .test-card-list li {
      padding: 10px;
      background: #f5f5f5;
      border-radius: 4px;
      margin-bottom: 10px;
      font-size: 13px;
    }

    .test-card-list strong {
      color: #333;
    }

    .test-card-list code {
      background: white;
      padding: 2px 4px;
      border-radius: 2px;
      color: #e74c3c;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- 標題 -->
    <div class="header">
      <h1>🔐 ECPay 信用卡支付測試工具</h1>
      <p>直接在網頁中測試 ECPay 支付初始化、回調驗證和 CheckMacValue 簽名</p>
      <div class="config-info" id="configInfo"></div>
    </div>

    <!-- 主要內容 -->
    <div class="main">
      <!-- 1. 支付初始化測試 -->
      <div class="card">
        <h2>1️⃣ 支付初始化</h2>
        <form id="initForm">
          <div class="form-group">
            <label>訂單 ID</label>
            <input type="text" id="orderId" placeholder="例：TEST_ORDER_001" value="TEST_ORDER_001" required>
          </div>
          <div class="form-group">
            <label>支付金額 (TWD)</label>
            <input type="number" id="amount" placeholder="例：1000" value="1000" min="1" required>
          </div>
          <div class="button-group">
            <button type="submit" class="btn btn-primary">
              <span id="initBtnText">發起支付初始化</span>
            </button>
            <button type="button" class="btn btn-secondary" onclick="clearInitResult()">清除結果</button>
          </div>
          <div id="initResult" class="result"></div>
          <div id="formHtmlContainer" class="form-html" style="display: none;">
            <strong>ECPay 表單 HTML：</strong>
            <code id="formHtml"></code>
          </div>
        </form>
      </div>

      <!-- 2. CheckMacValue 驗證 -->
      <div class="card">
        <h2>2️⃣ CheckMacValue 驗證</h2>

        <!-- 切換標籤 -->
        <div class="tab-buttons">
          <button class="tab-btn active" onclick="switchVerifyTab('json')">JSON 格式</button>
          <button class="tab-btn" onclick="switchVerifyTab('string')">參數字符串</button>
        </div>

        <!-- JSON 格式標籤頁 -->
        <div id="verify-json-tab" class="tab-content active">
          <form id="verifyCryptoForm">
            <div class="form-group">
              <label>回調數據 (JSON)</label>
              <textarea id="callbackData" style="width: 100%; min-height: 150px; font-family: monospace; font-size: 12px;" placeholder='{"MerchantID":"3002607","MerchantTradeNo":"TEST_001_1234567890"}' required></textarea>
            </div>
            <div class="form-group">
              <label>CheckMacValue</label>
              <input type="text" id="checkMacValue" placeholder="輸入 CheckMacValue 值" required>
            </div>
            <div class="button-group">
              <button type="submit" class="btn btn-primary">驗證簽名</button>
              <button type="button" class="btn btn-secondary" onclick="clearVerifyResult()">清除結果</button>
            </div>
            <div id="verifyResult" class="result"></div>
          </form>
        </div>

        <!-- 參數字符串格式標籤頁 -->
        <div id="verify-string-tab" class="tab-content">
          <form id="verifyStringForm">
            <div class="form-group">
              <label>參數字符串（直接貼上官方範例）</label>
              <textarea id="paramString" style="width: 100%; min-height: 150px; font-family: monospace; font-size: 12px;" placeholder="例：TradeDesc=促銷方案&PaymentType=aio&MerchantTradeDate=2023/03/12 15:30:23&MerchantTradeNo=ecpay20230312153023&MerchantID=3002607&ReturnURL=https://www.ecpay.com.tw/receive.php&ItemName=Apple iphone 15&TotalAmount=30000&ChoosePayment=ALL&EncryptType=1" required></textarea>
            </div>
            <div class="form-group">
              <label>CheckMacValue</label>
              <input type="text" id="paramCheckMacValue" placeholder="輸入 CheckMacValue 值" required>
            </div>
            <div class="button-group">
              <button type="submit" class="btn btn-primary">驗證簽名</button>
              <button type="button" class="btn btn-secondary" onclick="clearStringVerifyResult()">清除結果</button>
            </div>
            <div id="stringVerifyResult" class="result"></div>
          </form>
        </div>
      </div>

      <!-- 3. 回調模擬 -->
      <div class="card">
        <h2>3️⃣ 回調通知模擬</h2>
        <form id="callbackForm">
          <div class="form-group">
            <label>MerchantTradeNo</label>
            <input type="text" id="callbackMerchantTradeNo" placeholder="例：TEST_ORDER_001_1735731600" value="TEST_ORDER_001_1735731600" required>
          </div>
          <div class="form-group">
            <label>金額 (TWD)</label>
            <input type="number" id="callbackAmount" value="1000" min="1" required>
          </div>
          <div class="form-group">
            <label>交易狀態</label>
            <select id="callbackStatus">
              <option value="1">✅ 成功 (RtnCode: 1)</option>
              <option value="0">❌ 失敗 (RtnCode: 0)</option>
            </select>
          </div>
          <div class="button-group">
            <button type="submit" class="btn btn-primary">模擬回調</button>
            <button type="button" class="btn btn-secondary" onclick="clearCallbackResult()">清除結果</button>
          </div>
          <div id="callbackResult" class="result"></div>
        </form>
      </div>

      <!-- 4. 測試工具 -->
      <div class="card">
        <h2>4️⃣ 測試信息</h2>
        <div style="margin-top: 15px;">
          <h3 style="color: #333; margin-bottom: 10px;">📋 測試信用卡</h3>
          <ul class="test-card-list">
            <li>
              <strong>卡號：</strong><code>4311-9511-1111-1111</code><br>
              <strong>有效期：</strong>任何未來日期 (例：12/27)<br>
              <strong>CVV：</strong>任何三位數 (例：123)<br>
              <strong>3D 驗證碼：</strong><code>1234</code>
            </li>
            <li>
              <strong>備選卡號：</strong><code>4311-9522-2222-2222</code><br>
              <strong>其他信息同上</strong>
            </li>
          </ul>

          <h3 style="color: #333; margin: 20px 0 10px;">🔧 快速操作</h3>
          <div class="button-group">
            <button class="btn btn-secondary" onclick="fillTestData()">填入測試數據</button>
            <button class="btn btn-secondary" onclick="generateMerchantTradeNo()">生成 MerchantTradeNo</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    // 初始化頁面
    async function initPage() {
      try {
        const response = await fetch('/api/test/ecpay/api/config');
        const data = await response.json();
        const config = data.result;

        const configHtml = \`
          <div class="config-item">
            <strong>商家 ID</strong>
            <code>\${config.merchantId}</code>
          </div>
          <div class="config-item">
            <strong>環境</strong>
            <code>\${config.environment === 'stage' ? '🧪 測試環境' : '🚀 正式環境'}</code>
          </div>
          <div class="config-item">
            <strong>API 端點</strong>
            <code style="font-size: 11px;">\${config.apiUrl}</code>
          </div>
          <div class="config-item">
            <strong>回調地址</strong>
            <code style="font-size: 11px;">\${config.returnUrl}</code>
          </div>
        \`;

        document.getElementById('configInfo').innerHTML = configHtml;
      } catch (error) {
        console.error('載入配置失敗:', error);
      }
    }

    // 支付初始化表單提交
    document.getElementById('initForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const orderId = document.getElementById('orderId').value;
      const amount = parseInt(document.getElementById('amount').value);

      const btnText = document.getElementById('initBtnText');
      const originalText = btnText.textContent;
      btnText.innerHTML = '<span class="spinner"></span> 處理中...';
      btnText.parentElement.disabled = true;

      try {
        const response = await fetch('/api/test/ecpay/api/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, amount }),
        });

        const result = await response.json();

        if (result.result && result.result.success) {
          // 自動填入回調測試的 MerchantTradeNo
          if (result.result.data) {
            document.getElementById('callbackMerchantTradeNo').value = result.result.data.merchantTradeNo;
          }

          // 自動重定向到 ECPay 支付頁面
          if (result.result.data && result.result.data.formHtml) {
            // 顯示 HTML 表單（用於備份/參考）
            document.getElementById('formHtml').textContent = result.result.data.formHtml;
            document.getElementById('formHtmlContainer').style.display = 'block';

            // 延遲 1 秒後自動重定向，讓用戶看到成功訊息
            setTimeout(() => {
              submitFormToECPayWindow(result.result.data.formHtml);
            }, 1000);
          }
        } else {
          showResult('initResult', 'error', '❌ 初始化失敗', result.error || JSON.stringify(result));
        }
      } catch (error) {
        showResult('initResult', 'error', '❌ 請求失敗', error.message);
      } finally {
        btnText.textContent = originalText;
        btnText.parentElement.disabled = false;
      }
    });

    // CheckMacValue 驗證表單提交（JSON 格式）
    document.getElementById('verifyCryptoForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      try {
        const dataJson = JSON.parse(document.getElementById('callbackData').value);
        const checkMacValue = document.getElementById('checkMacValue').value;

        const response = await fetch('/api/test/ecpay/api/verify-checkmac', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: dataJson, checkMacValue }),
        });

        const result = await response.json();

        if (result.result && result.result.success) {
          const status = result.result.data.isValid ? 'success' : 'error';
          const icon = result.result.data.isValid ? '✅' : '❌';
          showResult('verifyResult', status, icon + ' ' + result.result.data.message, JSON.stringify(result.result.data, null, 2));
        } else {
          showResult('verifyResult', 'error', '❌ 驗證失敗', result.error || JSON.stringify(result));
        }
      } catch (error) {
        showResult('verifyResult', 'error', '❌ JSON 格式錯誤', error.message);
      }
    });

    // CheckMacValue 計算表單提交（參數字符串格式）- 顯示詳細步驟
    document.getElementById('verifyStringForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      try {
        const paramString = document.getElementById('paramString').value;
        const checkMacValue = document.getElementById('paramCheckMacValue').value;

        // 先計算詳細步驟
        const response = await fetch('/api/test/ecpay/api/calculate-checkmac-from-string', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paramString }),
        });

        const result = await response.json();

        if (result.result && result.result.success) {
          const data = result.result.data;
          const calculatedCheckMacValue = data.checkMacValue;
          const isMatched = calculatedCheckMacValue === checkMacValue;

          // 格式化步驟結果
          let stepsHtml = '<h3 style="margin-top: 20px; color: #333;">📊 CheckMacValue 計算步驟詳解</h3>';
          stepsHtml += '<table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px;">';
          stepsHtml += '<tr style="background: #f0f0f0; border-bottom: 2px solid #ddd;"><th style="padding: 10px; text-align: left; border: 1px solid #ddd;">步驟</th><th style="padding: 10px; text-align: left; border: 1px solid #ddd;">結果</th></tr>';

          // 遍歷所有步驟
          const steps = ['step1_sortedParams', 'step2_withHashKeyIV', 'step3_urlEncoded', 'step4_lowercase', 'step5_sha256', 'step6_checkMacValue'];
          steps.forEach((stepKey, index) => {
            const step = data.steps[stepKey];
            const bgColor = index % 2 === 0 ? '#fff' : '#f9f9f9';
            stepsHtml += \`<tr style="background: \${bgColor}; border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; border: 1px solid #ddd; vertical-align: top; font-weight: 500; width: 25%;">\${step.description}</td>
              <td style="padding: 10px; border: 1px solid #ddd; word-break: break-all; font-family: monospace; font-size: 12px;"><code>\${escapeHtml(step.result)}</code></td>
            </tr>\`;
          });

          stepsHtml += '</table>';

          // 驗證結果
          const verifyStatus = isMatched ? 'success' : 'error';
          const verifyIcon = isMatched ? '✅' : '❌';
          const verifyMessage = isMatched ? 'CheckMacValue 驗證成功！' : 'CheckMacValue 不匹配！';

          stepsHtml += \`<div style="margin-top: 20px; padding: 15px; border-radius: 4px; background: \${isMatched ? '#d4edda' : '#f8d7da'}; border: 1px solid \${isMatched ? '#c3e6cb' : '#f5c6cb'};">
            <strong style="color: \${isMatched ? '#155724' : '#721c24'}">\${verifyIcon} \${verifyMessage}</strong><br>
            <div style="margin-top: 10px; font-size: 12px;">
              <strong>計算得到的 CheckMacValue：</strong><br>
              <code style="background: white; padding: 8px; display: block; border-radius: 3px; margin-top: 5px;">\${calculatedCheckMacValue}</code>
            </div>
            <div style="margin-top: 10px; font-size: 12px;">
              <strong>官方提供的 CheckMacValue：</strong><br>
              <code style="background: white; padding: 8px; display: block; border-radius: 3px; margin-top: 5px;">\${checkMacValue}</code>
            </div>
          </div>\`;

          const resultElement = document.getElementById('stringVerifyResult');
          resultElement.className = 'result ' + verifyStatus;
          resultElement.innerHTML = stepsHtml;
        } else {
          showResult('stringVerifyResult', 'error', '❌ 計算失敗', result.error || JSON.stringify(result));
        }
      } catch (error) {
        showResult('stringVerifyResult', 'error', '❌ 參數格式錯誤', error.message);
      }
    });

    // 回調模擬表單提交
    document.getElementById('callbackForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const merchantTradeNo = document.getElementById('callbackMerchantTradeNo').value;
      const amount = parseInt(document.getElementById('callbackAmount').value);
      const rtnCode = parseInt(document.getElementById('callbackStatus').value);

      try {
        const response = await fetch('/api/test/ecpay/api/simulate-callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ merchantTradeNo, amount, rtnCode }),
        });

        const result = await response.json();

        if (result.result && result.result.success) {
          showResult('callbackResult', 'success', '✅ 回調模擬成功', JSON.stringify(result.result.data, null, 2));
        } else {
          showResult('callbackResult', 'error', '❌ 回調失敗', result.error || JSON.stringify(result));
        }
      } catch (error) {
        showResult('callbackResult', 'error', '❌ 請求失敗', error.message);
      }
    });

    // 在新分頁中打開支付表單
    function submitFormToECPayWindow(formHtml) {
      try {
        const newWindow = window.open('', '_blank');
        if (!newWindow) {
          showResult('initResult', 'error', '❌ 彈出新分頁被阻止', '請允許彈出視窗以進行支付。');
          return;
        }

        // 將 HTML 寫入新視窗
        newWindow.document.open();
        newWindow.document.write(formHtml);
        newWindow.document.close();

        // 自動提交表單
        setTimeout(() => {
          const form = newWindow.document.querySelector('form');
          if (form) {
            form.submit();
          }
        }, 500);

        showResult('initResult', 'success', '✅ 支付頁面已在新分頁中打開', '正在重定向至 ECPay 支付頁面...');
      } catch (err) {
        console.error('打開新分頁錯誤:', err);
        showResult('initResult', 'error', '❌ 打開新分頁失敗', err.message);
      }
    }

    // HTML 轉義函數
    function escapeHtml(text) {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return text.replace(/[&<>"']/g, (m) => map[m]);
    }

    // 顯示結果
    function showResult(elementId, type, title, message) {
      const element = document.getElementById(elementId);
      element.className = \`result \${type}\`;
      element.innerHTML = \`
        <pre>\${typeof message === 'string' ? escapeHtml(message) : JSON.stringify(message, null, 2)}</pre>
      \`;
    }

    // 清除結果
    function clearInitResult() {
      document.getElementById('initResult').className = 'result';
      document.getElementById('formHtmlContainer').style.display = 'none';
    }

    function clearVerifyResult() {
      document.getElementById('verifyResult').className = 'result';
    }

    function clearStringVerifyResult() {
      document.getElementById('stringVerifyResult').className = 'result';
    }

    function clearCallbackResult() {
      document.getElementById('callbackResult').className = 'result';
    }

    // 切換 CheckMacValue 驗證標籤
    function switchVerifyTab(tabName) {
      // 隱藏所有標籤頁
      document.getElementById('verify-json-tab').classList.remove('active');
      document.getElementById('verify-string-tab').classList.remove('active');

      // 隱藏所有標籤按鈕的 active 狀態
      const tabBtns = document.querySelectorAll('.tab-btn');
      tabBtns.forEach(btn => btn.classList.remove('active'));

      // 顯示選定的標籤頁
      if (tabName === 'json') {
        document.getElementById('verify-json-tab').classList.add('active');
        tabBtns[0].classList.add('active');
      } else if (tabName === 'string') {
        document.getElementById('verify-string-tab').classList.add('active');
        tabBtns[1].classList.add('active');
      }
    }

    // 填入測試數據
    function fillTestData() {
      const now = Math.floor(Date.now() / 1000);
      document.getElementById('orderId').value = 'TEST_ORDER_' + now;
      document.getElementById('amount').value = 1000;
      document.getElementById('callbackMerchantTradeNo').value = 'TEST_ORDER_' + now + '_' + now;
      document.getElementById('callbackAmount').value = 1000;
    }

    // 生成 MerchantTradeNo
    function generateMerchantTradeNo() {
      const orderId = document.getElementById('orderId').value || 'TEST_ORDER';
      const timestamp = Math.floor(Date.now() / 1000);
      const merchantTradeNo = orderId + '_' + timestamp;
      document.getElementById('callbackMerchantTradeNo').value = merchantTradeNo;
    }

    // 頁面加載完成後初始化
    document.addEventListener('DOMContentLoaded', initPage);
  </script>
</body>
</html>
    `;
  }
}
