import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { ContentManagementService } from './contentManagementService.service';
import {
  CreateHomeVideoRequestDTO,
  GetContentManagementResponseDTO,
  GetHomeBannerResponseDTO,
  GetHomeVideoResponseDTO,
  ResWithPaginationDTO,
  UpdateHomeBannerRequestDTO,
} from '@repo/shared';
import { CustomRequest } from 'src/shared/interfaces/custom-request';

@Controller('/content-management')
export class ContentManagementController {
  constructor(private contentManagementService: ContentManagementService) {}

  /**
   * get content management table list
   */
  @Get('/')
  @UseGuards(AuthGuard)
  getList(): Promise<ResWithPaginationDTO<GetContentManagementResponseDTO[]>> {
    return this.contentManagementService.getList();
  }

  /********************************************
   *             -- home banner --             *
   ********************************************/

  /**
   * get home banner
   */
  @Get('/home-banner')
  @UseGuards(AuthGuard)
  getHomeBanner(): Promise<GetHomeBannerResponseDTO> {
    return this.contentManagementService.getHomeBanner();
  }

  /**
   * update home banner
   */
  @Patch('/home-banner')
  @UseGuards(AuthGuard)
  updateHomeBanner(
    @Body() body: UpdateHomeBannerRequestDTO,
    @Req() request: CustomRequest,
  ) {
    const userId = request['user'].sub;
    return this.contentManagementService.updateHomeBanner(body, userId);
  }

  /********************************************
   *             -- home video --             *
   ********************************************/

  /**
   * get home video
   */
  @Get('/home-video')
  @UseGuards(AuthGuard)
  getHomeVideo(): Promise<GetHomeVideoResponseDTO[]> {
    return this.contentManagementService.getHomeVideo();
  }

  /**
   * create home video
   */
  @Post('/home-video')
  @UseGuards(AuthGuard)
  createHomeVideo(
    @Body() body: CreateHomeVideoRequestDTO[],
    @Req() request: CustomRequest,
  ) {
    const userId = request['user'].sub;
    return this.contentManagementService.createHomeVideo(body, userId);
  }
}
