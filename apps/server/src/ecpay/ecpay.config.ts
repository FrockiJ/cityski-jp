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
  readonly returnUrl: string;
  readonly orderResultUrl: string;
  readonly clientBackUrl: string;
  readonly clientDomain: string;

  constructor(private configService: ConfigService) {
    this.merchantId = this.configService.get<string>('ECPAY_MERCHANT_ID');
    this.hashKeyPayment = this.configService.get<string>(
      'ECPAY_HASH_KEY_PAYMENT',
    );
    this.hashIvPayment = this.configService.get<string>(
      'ECPAY_HASH_IV_PAYMENT',
    );
    this.apiUrlStage = this.configService.get<string>(
      'ECPAY_API_URL_STAGE',
    );
    this.apiUrlProd = this.configService.get<string>(
      'ECPAY_API_URL_PROD',
    );
    this.environment = this.configService.get<string>('ECPAY_ENVIRONMENT', 'stage');
    this.returnUrl = this.configService.get<string>(
      'ECPAY_RETURN_URL',
    );
    this.clientDomain = this.configService.get<string>('CLIENT_DOMAIN');
    this.orderResultUrl = this.configService.get<string>(
      'ECPAY_ORDER_RESULT_URL',
      `${this.clientDomain}/courses/order-result`,
    );
    this.clientBackUrl = this.configService.get<string>(
      'ECPAY_CLIENT_BACK_URL',
      `${this.clientDomain}/courses/order-success`,
    );
  }

  getApiUrl(): string {
    return this.environment === 'prod' ? this.apiUrlProd : this.apiUrlStage;
  }
}

