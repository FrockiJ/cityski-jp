import {
  Controller,
  Get,
  Logger,
  Query,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
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
      success: true,
      data: plainToInstance(GetInventoryResponseDTO, result, {
        excludeExtraneousValues: true,
      }),
    };
  }
}
