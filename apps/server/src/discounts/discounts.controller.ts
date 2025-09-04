import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { DiscountsService } from './discounts.service';
import {
  CheckDiscountCodeRequestDTO,
  CreateDiscountRequestDTO,
  GetClientDiscountResponseDTO,
  GetDiscountRequestDTO,
  GetDiscountResponseDTO,
  ResWithPaginationDTO,
  UpdateDiscountRequestDTO,
} from '@repo/shared';
import { CustomRequest } from 'src/shared/interfaces/custom-request';
// import { ClientAuthGuard } from 'src/guards/client-auth.guard';

@Controller('/discounts')
export class DiscountsController {
  constructor(private discountsService: DiscountsService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  getDiscounts(
    @Query() query: GetDiscountRequestDTO,
  ): Promise<ResWithPaginationDTO<GetDiscountResponseDTO[]>> {
    return this.discountsService.getDiscounts(query);
  }

  @Get('/check-code')
  @UseGuards(AuthGuard)
  checkDiscountCode(@Query() query: CheckDiscountCodeRequestDTO) {
    return this.discountsService.checkDiscountCode(query);
  }

  @Post('/')
  @UseGuards(AuthGuard)
  createDiscount(
    @Body() body: CreateDiscountRequestDTO,
    @Req() request: CustomRequest,
  ): Promise<any> {
    const userId = request['user'].sub;
    return this.discountsService.createDiscount(body, userId);
  }

  @Patch('/')
  @UseGuards(AuthGuard)
  updateDiscount(
    @Body() body: UpdateDiscountRequestDTO,
    @Req() request: CustomRequest,
  ) {
    const userId = request['user'].sub;
    return this.discountsService.updateDiscount(body, userId);
  }

  @Patch('/status/:id')
  @UseGuards(AuthGuard)
  updateStatus(@Param('id') id: string, @Req() request: CustomRequest) {
    const userId = request['user'].sub;
    return this.discountsService.updateStatus(id, userId);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  deleteDiscount(@Param('id') id: string) {
    return this.discountsService.deleteDiscount(id);
  }

  /********************************************
   *              -- CLIENT --                *
   ********************************************/

  @Get('/client')
  // @UseGuards(ClientAuthGuard)
  clientGetDiscount(
    @Query() query: CheckDiscountCodeRequestDTO,
  ): Promise<GetClientDiscountResponseDTO> {
    return this.discountsService.clientGetDiscount(query);
  }
}
