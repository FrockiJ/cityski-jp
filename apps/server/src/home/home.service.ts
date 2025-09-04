import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomeBanner } from 'src/contentManagement/entities/homeBanner.entity';
import { HomeVideo } from 'src/contentManagement/entities/homeVideo.entity';
import { File } from 'src/files/entities/file.entity';
import { GetHomeAdBannerResponseDTO } from '@repo/shared';
@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(HomeBanner)
    private readonly homeBannerRepo: Repository<HomeBanner>,
    @InjectRepository(HomeVideo)
    private readonly homeVideoRepo: Repository<HomeVideo>,
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
  ) {}

  async getAdBanner(): Promise<GetHomeAdBannerResponseDTO> {
    const [adBanner] = await this.homeBannerRepo.find();
    const desktopImgSrc = await this.fileRepo.findOne({
      where: {
        tableId: adBanner.id,
        tableName: 'homeBanner',
        deviceType: 'D',
      },
      order: { updatedTime: 'DESC' },
    });
    const mobileImgSrc = await this.fileRepo.findOne({
      where: {
        tableId: adBanner.id,
        tableName: 'homeBanner',
        deviceType: 'M',
      },
      order: { updatedTime: 'DESC' },
    });
    return {
      buttonUrl: adBanner.buttonUrl,
      desktopImgSrc: desktopImgSrc.fileUrl,
      mobileImgSrc: mobileImgSrc.fileUrl,
    };
  }

  async getVideos() {
    return this.homeVideoRepo.find();
  }
}
