import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from 'src/guards/auth.guard';
import { ReservationsService } from './reservations.service';
import {
  CancelReservationRequestDto,
  CreateReservationRequestDto,
  CreateReservationResponseDTO,
  UpdateReservationRequestDto,
  GetReservationsRequestDto,
  GetReservationDetailResponseDto,
  GetLinkedOrdersResponseDto,
  ReservationResponseDto,
  ResWithPaginationDTO,
} from '@repo/shared';
import { CustomRequest } from 'src/shared/interfaces/custom-request';
import { ReservationStatus } from './entities/reservation.entity';
import { AdminOrMemberGuard } from 'src/guards/admin-or-member.guard';

@Controller('/reservations')
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async getReservations(
    @Query() request: GetReservationsRequestDto,
  ): Promise<ResWithPaginationDTO<ReservationResponseDto[]>> {
    const result = await this.reservationsService.getReservations(request);
    return {
      ...result,
      data: plainToInstance(ReservationResponseDto, result.data, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/slots')
  async getReservationSlots(@Query() query: any): Promise<any> {
    return this.reservationsService.getReservationSlots(query);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getReservationDetail(
    @Param('id') id: string,
  ): Promise<GetReservationDetailResponseDto> {
    const result = await this.reservationsService.getReservationDetail(id);
    return plainToInstance(GetReservationDetailResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AdminOrMemberGuard)
  @Post('/')
  async createReservation(
    @Body() body: CreateReservationRequestDto,
    @Req() request: CustomRequest,
  ): Promise<CreateReservationResponseDTO> {
    const userId = request['user']?.sub;
    const result = await this.reservationsService.createReservation(
      body,
      userId,
    );
    return plainToInstance(CreateReservationResponseDTO, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/:id/linked-orders')
  async getLinkedOrders(
    @Param('id') id: string,
  ): Promise<GetLinkedOrdersResponseDto> {
    const result = await this.reservationsService.getLinkedOrders(id);
    return result; // Already returns correct DTO format
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async updateReservation(
    @Param('id') id: string,
    @Body() body: UpdateReservationRequestDto,
    @Req() request: CustomRequest,
  ): Promise<GetReservationDetailResponseDto> {
    const userId = request['user']?.sub;
    const result = await this.reservationsService.updateReservation(
      id,
      body,
      userId,
    );
    return plainToInstance(GetReservationDetailResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard)
  @Put('/:id/status')
  async updateReservationStatus(
    @Param('id') id: string,
    @Body() body: { status: ReservationStatus },
    @Req() request: CustomRequest,
  ) {
    const userId = request['user']?.sub;
    return this.reservationsService.updateReservationStatus(
      id,
      body.status,
      userId,
    );
  }

  @UseGuards(AuthGuard)
  @Put('/:id/cancel')
  async cancelReservation(
    @Param('id') id: string,
    @Body() body: CancelReservationRequestDto,
    @Req() request: CustomRequest,
  ): Promise<GetReservationDetailResponseDto> {
    const userId = request['user']?.sub;
    const result = await this.reservationsService.cancelReservation(
      id,
      body.reason,
      userId,
    );
    return plainToInstance(GetReservationDetailResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }
}
