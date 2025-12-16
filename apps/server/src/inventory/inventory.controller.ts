import {
  Controller,
  Get,
  Logger,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { InventoryService } from './inventory.service';
import {
  GetInventoryRequestDTO,
  GetInventoryResponseDTO,
  ResponseWrapper,
} from '@repo/shared';

@Controller('/inventory')
export class InventoryController {
  private readonly logger = new Logger(InventoryController.name);

  constructor(private inventoryService: InventoryService) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async getInventory(
    @Query() request: GetInventoryRequestDTO,
  ): Promise<ResponseWrapper<GetInventoryResponseDTO>> {
    const result = await this.inventoryService.getInventory(request);
    return {
      statusCode: 200,
      status: 'success',
      message: 'Inventory retrieved successfully',
      result: plainToInstance(GetInventoryResponseDTO, result, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/export')
  async exportInventory(
    @Res() res: Response,
    @Query() request: GetInventoryRequestDTO,
  ): Promise<void> {
    try {
      await this.inventoryService.exportInventory(res, request);
    } catch (error) {
      this.logger.error('Error exporting inventory:', error);
      res.status(500).json({ error: 'Failed to export inventory' });
    }
  }
}
