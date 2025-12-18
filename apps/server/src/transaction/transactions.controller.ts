import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { TransactionsService } from './transactions.service';
import { PayDepositRequestDTO, SettleTransactionRequestDTO, SelectBalancePaymentMethodRequestDTO } from '@repo/shared';
import { CustomRequest } from 'src/shared/interfaces/custom-request';
import { ClientAuthGuard } from 'src/guards/client-auth.guard';
@Controller('/transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @UseGuards(AuthGuard)
  @Patch('/')
  payDeposit(
    @Body() body: PayDepositRequestDTO,
    @Req() request: CustomRequest,
  ) {
    const memberId = request['user'].sub;
    return this.transactionsService.payDeposit(body, memberId);
  }

  @UseGuards(AuthGuard)
  @Patch('/settle')
  async settleTransaction(
    @Body() body: SettleTransactionRequestDTO,
    @Req() request: CustomRequest,
  ) {
    const { orderId, balanceDate, paymentMethod, invoice } = body;
    return this.transactionsService.settleTransaction(
      orderId,
      new Date(balanceDate),
      paymentMethod,
      invoice,
    );
  }

  @UseGuards(ClientAuthGuard)
  @Patch('/select-balance-payment-method')
  selectBalancePaymentMethod(
    @Body() body: SelectBalancePaymentMethodRequestDTO,
    @Req() request: CustomRequest,
  ) {
    const memberId = request['user'].sub;
    return this.transactionsService.selectBalancePaymentMethod(
      body.orderId,
      body.paymentMethod,
      memberId,
    );
  }
}
