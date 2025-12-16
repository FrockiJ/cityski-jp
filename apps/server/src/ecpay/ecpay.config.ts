import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EcpayConfig {
  readonly merchantId: string;
  readonly hashKeyPayment: string;
  readonly hashIvPayment: string;
  readonly apiUrl: string;
  readonly returnUrl: string;
  readonly orderResultUrl: string;
  readonly clientDomain: string;

  constructor(private configService: ConfigService) {
    this.merchantId = this.configService.get<string>('ECPAY_MERCHANT_ID');
    this.hashKeyPayment = this.configService.get<string>('ECPAY_HASH_KEY_PAYMENT');
    this.hashIvPayment = this.configService.get<string>('ECPAY_HASH_IV_PAYMENT');
    this.apiUrl = this.configService.get<string>('ECPAY_API_URL');
    this.clientDomain = this.configService.get<string>('ECPAY_CLIENT_DOMAIN');

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
    return this.apiUrl;
  }
}

