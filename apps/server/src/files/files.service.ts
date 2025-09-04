import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { S3Service } from 'src/utils/fileUpload/S3Service';
import { FileUploadResponseDTO } from '@repo/shared';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly filesRepo: Repository<File>,
  ) {}

  async upload(file: Express.Multer.File): Promise<FileUploadResponseDTO> {
    try {
      const s3Service = new S3Service();
      const s3FileRes = await s3Service.upload(file);
      return {
        key: s3FileRes.key,
      };
    } catch (err) {
      throw err;
    }
  }

  async updateFilesWithTransaction(
    data,
    tableId: string,
    tableName: string,
    queryRunner: QueryRunner,
  ) {
    const dbFiles = await queryRunner.manager.find(File, {
      where: { tableId, tableName },
    });

    const updateFileIds = data.map((people) => people.id);
    const deleteFiles = dbFiles.filter(
      (row) => !updateFileIds.includes(row.id),
    );
    if (deleteFiles.length > 0) {
      await queryRunner.manager.remove(File, deleteFiles);
    }

    // new files
    const files = data.map((file) => {
      const newFile = new File();
      return this.filesRepo.create({
        ...newFile,
        id: file.id,
        tableId,
        tableName,
        mediaType: file.mediaType,
        deviceType: file.deviceType,
        fileUrl: file.key,
        originalName: file.originalName,
        description: file.originalName.split('.')[0],
        sequence: file.sequence,
        updatedTime: new Date(),
      });
    });

    await queryRunner.manager.save(files);
  }
}
