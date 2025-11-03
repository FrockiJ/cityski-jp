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
import { AuthGuard } from 'src/guards/auth.guard';
import { ReservationsService,
  CreateReservationRequestDTO,
  UpdateReservationRequestDTO,
  GetReservationsRequestDTO,
  GetReservationDetailResponseDTO,
  ResWithPaginationDTO
} from './reservations.service';
import { CustomRequest } from 'src/shared/interfaces/custom-request';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Controller('/reservations')
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @UseGuards(AuthGuard)
  @Get('/')
  getReservations(
    @Query() request: GetReservationsRequestDTO,
  ): Promise<ResWithPaginationDTO<Reservation[]>> {
    return this.reservationsService.getReservations(request);
  }
  @UseGuards(AuthGuard)
  @Get('/:id')
  getReservationDetail(
    @Param('id') id: string,
  ): Promise<GetReservationDetailResponseDTO> {
    return  this.reservationsService.getReservationDetail(id);
  }

  @UseGuards(AuthGuard)
  @Post('/')
  createReservation(
    @Body() body: CreateReservationRequestDTO,
    @Req() request: CustomRequest,
  ) {
    const userId = request['user']?.sub;
    return this.reservationsService.createReservation(body, userId);
  }

  @UseGuards(AuthGuard)
  @Get('/:id/linked-orders')
  getLinkedOrders(@Param('id') id: string) {
    return this.reservationsService.getLinkedOrders(id);
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  updateReservation(
    @Param('id') id: string,
    @Body() body: UpdateReservationRequestDTO,
    @Req() request: CustomRequest,
  ) {
    const userId = request['user']?.sub;
    return this.reservationsService.updateReservation(id, body, userId);
  }

  @UseGuards(AuthGuard)
  @Put('/:id/status')
  updateReservationStatus(
    @Param('id') id: string,
    @Body() body: { status: ReservationStatus },
    @Req() request: CustomRequest,
  ) {
    const userId = request['user']?.sub;
    return this.reservationsService.updateReservationStatus(id, body.status, userId);
  }
}