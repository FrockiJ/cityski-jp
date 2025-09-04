import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AttachmentDeviceType,
  CreateHomeVideoRequestDTO,
  GetContentManagementResponseDTO,
  GetHomeBannerResponseDTO,
  GetHomeVideoResponseDTO,
  HomeAreaType,
  ResWithPaginationDTO,
  UpdateHomeBannerRequestDTO,
} from '@repo/shared';

import { CustomException } from 'src/common/exception/custom.exception';
import { HomeBanner } from './entities/homeBanner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomeVideo } from './entities/homeVideo.entity';
import { User } from 'src/users/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { File } from 'src/files/entities/file.entity';

@Injectable()
export class ContentManagementService {
  constructor(
    @InjectRepository(HomeBanner)
    private readonly homeBannerRepo: Repository<HomeBanner>,
    @InjectRepository(HomeVideo)
    private readonly homeVideoRepo: Repository<HomeVideo>,
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
  ) {
    this.initialize();
  }
  /**
   * get content management table list
   */
  async getList(): Promise<
    ResWithPaginationDTO<GetContentManagementResponseDTO[]>
  > {
    try {
      const homeBanner = await this.homeBannerRepo
        .createQueryBuilder('homeBanner')
        .leftJoinAndSelect(User, 'user', 'user.id = homeBanner.updatedUser')
        .getRawOne();
      const homeVideo = await this.homeVideoRepo
        .createQueryBuilder('homeVideo')
        .leftJoinAndSelect(User, 'user', 'user.id = homeVideo.updatedUser')
        .getRawOne();

      const formattedData = [
        {
          id: homeBanner?.homeBanner_id,
          homeAreaType: HomeAreaType.BANNER,
          homeAreaTitle: '單幅廣告',
          updatedUser: homeBanner?.user_name ?? '',
          updatedTime: homeBanner?.homeBanner_updated_time ?? '',
        },
        {
          id: homeVideo?.homeVideo_id,
          homeAreaTitle: '影片專區',
          homeAreaType: HomeAreaType.VIDEO,
          updatedUser: homeVideo?.user_name ?? '',
          updatedTime: homeVideo?.homeVideo_updated_time ?? '',
        },
      ];

      return {
        data: formattedData,
        total: 0,
        page: 0,
        limit: 0,
        pages: 0,
      };
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /********************************************
   *             -- home banner --             *
   ********************************************/

  /**
   * create default db data
   */
  async initialize() {
    try {
      const homeBanner = await this.homeBannerRepo.find();
      if (homeBanner.length === 0) {
        const homeBannerInstance = new HomeBanner();
        this.homeBannerRepo.save(homeBannerInstance);
      }
    } catch (err) {
      console.log('err', err);
    }
  }

  /**
   * get home banner
   */
  async getHomeBanner(): Promise<GetHomeBannerResponseDTO> {
    try {
      const rawData = await this.homeBannerRepo
        .createQueryBuilder('homeBanner')
        .leftJoinAndSelect(
          File,
          'file',
          'file.tableId = homeBanner.id AND file.tableName = :tableName',
          { tableName: 'homeBanner' },
        )
        .getRawMany();

      let homeBanner = [];
      if (rawData.length > 0) {
        homeBanner = rawData.reduce((acc, row) => {
          const existing = acc.find(
            (homeBanner) => homeBanner.id === row.homeBanner_id,
          );

          if (!existing) {
            acc.push({
              id: row.homeBanner_id,
              buttonUrl: row.homeBanner_button_url,
              files: row.file_id
                ? [
                    {
                      id: row.file_id,
                      tableName: row.file_table_name,
                      deviceType: row.file_device_type,
                      mediaType: row.file_media_type,
                      url: row.file_file_url,
                      originalName: row.file_original_name,
                      sequence: row.file_sequence,
                      description: row.file_description,
                    },
                  ]
                : [],
            });
          } else if (row.file_id) {
            existing.files.push({
              id: row.file_id,
              tableName: row.file_table_name,
              deviceType: row.file_device_type,
              mediaType: row.file_media_type,
              url: row.file_file_url,
              originalName: row.file_original_name,
              sequence: row.file_sequence,
              description: row.file_description,
            });
          }

          return acc;
        }, []);
      }

      if (homeBanner.length === 1) {
        const desktop = homeBanner[0].files.find(
          (file) => file.deviceType === AttachmentDeviceType.DESKTOP,
        );
        const mobile = homeBanner[0].files.find(
          (file) => file.deviceType === AttachmentDeviceType.MOBILE,
        );
        return {
          buttonUrl: homeBanner[0].buttonUrl,
          desktop: desktop
            ? {
                id: desktop.id,
                url: desktop.url,
                originalName: desktop.originalName,
                mediaType: desktop.mediaType,
                deviceType: desktop.deviceType,
                sequence: desktop.sequence,
                description: desktop.description,
              }
            : null,
          mobile: mobile
            ? {
                id: mobile.id,
                url: mobile.url,
                originalName: mobile.originalName,
                mediaType: mobile.mediaType,
                deviceType: mobile.deviceType,
                sequence: mobile.sequence,
                description: desktop.description,
              }
            : null,
        };
      } else {
        throw new CustomException('資料錯誤', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * update home banner
   */
  async updateHomeBanner(data: UpdateHomeBannerRequestDTO, userId: string) {
    try {
      const homeBanner = await this.homeBannerRepo.find();
      if (homeBanner.length === 1) {
        // update homeBanner table
        const updateHomeBanner = this.homeBannerRepo.create({
          ...homeBanner[0],
          buttonUrl: data.buttonUrl,
          updatedTime: new Date(),
          updatedUser: userId,
        });
        await this.homeBannerRepo.save(updateHomeBanner);

        // update file table
        const files = data.attachments.map((file) => {
          const newFile = new File();
          return this.fileRepo.create({
            ...newFile,
            tableId: homeBanner[0].id,
            tableName: 'homeBanner',
            mediaType: file.mediaType,
            deviceType: file.deviceType,
            fileUrl: file.key,
            originalName: file.originalName,
            description: file.originalName.split('.')[0],
            sequence: 1,
          });
        });
        await this.fileRepo.save(files);
      } else {
        throw new CustomException('資料錯誤', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /********************************************
   *             -- home video --             *
   ********************************************/

  /**
   * get home video
   */
  async getHomeVideo(): Promise<GetHomeVideoResponseDTO[]> {
    try {
      const homeVideos = await this.homeVideoRepo.find({
        order: {
          sort: 'ASC',
        },
      });

      return plainToInstance(GetHomeVideoResponseDTO, homeVideos, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * create home video
   */
  async createHomeVideo(data: CreateHomeVideoRequestDTO[], userId: string) {
    try {
      if (!data || (data.length !== 5 && data.length !== 10)) {
        throw new CustomException(
          '影片數量必須為5個或10個',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.homeVideoRepo.clear();
      const createData = data.map((item) => {
        return this.homeVideoRepo.create({
          ...new HomeVideo(),
          ...item,
          createdUser: userId,
          updatedUser: userId,
        });
      });

      await this.homeVideoRepo.save(createData);
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
