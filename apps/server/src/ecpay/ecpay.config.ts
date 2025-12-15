import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EcpayConfig {
  readonly merchantId: string;
  readonly hashKeyPayment: string;
  readonly hashIvPayment: string;
  readonly apiUrlStage: string;
  readonly apiUrlProd: string;
  readonly environment: string;
  readonly websiteEnvironment: string;
  readonly returnUrl: string;
  readonly orderResultUrl: string;
  readonly clientBackUrl: string;
  readonly clientDomain: string;

  constructor(private configService: ConfigService) {
    // 取得 ECPay 環境設定 (控制使用哪個商家帳號和 API)
    this.environment = this.configService.get<string>('ECPAY_ENVIRONMENT', 'stage');

    // 取得網站環境設定 (控制使用哪個域名)
    this.websiteEnvironment = this.configService.get<string>('WEBSITE_ENVIRONMENT', 'local');

    // 根據 ECPAY_ENVIRONMENT 切換帳號資訊
    if (this.environment === 'prod') {
      // 正式版帳號
      this.merchantId = this.configService.get<string>('ECPAY_MERCHANT_ID_PROD');
      this.hashKeyPayment = this.configService.get<string>('ECPAY_HASH_KEY_PAYMENT_PROD');
      this.hashIvPayment = this.configService.get<string>('ECPAY_HASH_IV_PAYMENT_PROD');
    } else {
      // 測試版帳號
      this.merchantId = this.configService.get<string>('ECPAY_MERCHANT_ID_STAGE');
      this.hashKeyPayment = this.configService.get<string>('ECPAY_HASH_KEY_PAYMENT_STAGE');
      this.hashIvPayment = this.configService.get<string>('ECPAY_HASH_IV_PAYMENT_STAGE');
    }

    this.apiUrlStage = this.configService.get<string>(
      'ECPAY_API_URL_STAGE',
    );
    this.apiUrlProd = this.configService.get<string>(
      'ECPAY_API_URL_PROD',
    );

    // 根據 WEBSITE_ENVIRONMENT 切換域名
    if (this.websiteEnvironment === 'uat') {
      this.clientDomain = this.configService.get<string>('ECPAY_CLIENT_DOMAIN_UAT');
    } else {
      // local 或其他預設使用 local 域名
      this.clientDomain = this.configService.get<string>('ECPAY_CLIENT_DOMAIN_LOCAL');
    }

    this.returnUrl = this.configService.get<string>(
      'ECPAY_RETURN_URL',
      `${this.clientDomain}/api/payments/credit-card/callback`,
    );
    this.orderResultUrl = this.configService.get<string>(
      'ECPAY_ORDER_RESULT_URL',
      `${this.clientDomain}/courses/order-result`,
    );
  }

  getApiUrl(): string {
    return this.environment === 'prod' ? this.apiUrlProd : this.apiUrlStage;
  }
}

