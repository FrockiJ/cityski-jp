import { Module } from '@nestjs/common';
import { EcpayService } from './ecpay.service';
import { EcpayController } from './ecpay.controller';
import { EcpayTestController } from './ecpay-test.controller';
import { EcpayConfig } from './ecpay.config';
import { EcpayCryptoService } from './ecpay-crypto.service';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [OrdersModule],
  providers: [EcpayService, EcpayConfig, EcpayCryptoService],
  controllers: [EcpayController, EcpayTestController],
  exports: [EcpayService, EcpayConfig, EcpayCryptoService],
})
export class EcpayModule {}
