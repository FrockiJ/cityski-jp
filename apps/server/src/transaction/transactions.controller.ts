import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { TransactionsService } from './transactions.service';
import { PayDepositRequestDTO } from '@repo/shared';
import { CustomRequest } from 'src/shared/interfaces/custom-request';
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
}
