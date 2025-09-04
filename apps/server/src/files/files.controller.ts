import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { FileUploadResponseDTO, HttpStatusCode } from '@repo/shared';
import { CustomRequest } from 'src/shared/interfaces/custom-request';

@Controller('/files')
export class FilesController {
  constructor(private homeBannerService: FilesService) {}

  @Post('/upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        console.log('file', file);
        const allowedTypes = [
          'image/png',
          'image/jpeg',
          'image/jpg',
          'video/mp4',
        ];
        if (!allowedTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException('png, jpeg, jpg或mp4的檔案類型'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: CustomRequest,
  ): Promise<FileUploadResponseDTO> {
    if (!file) {
      throw new BadRequestException('file為必填欄位');
    }
    if (file.size > 2097152) {
      throw new BadRequestException('請上傳小於2MB的檔案');
    }
    request.httpCode = HttpStatusCode.OK;
    return this.homeBannerService.upload(file);
  }
}
