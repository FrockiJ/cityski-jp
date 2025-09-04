import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { File } from 'src/files/entities/file.entity';
import { ContentManagementController } from './contentManagementService.controller';
import { ContentManagementService } from './contentManagementService.service';
import { HomeBanner } from './entities/homeBanner.entity';
import { HomeVideo } from './entities/homeVideo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HomeBanner, HomeVideo, User, File]),
    forwardRef(() => UsersModule),
  ],
  controllers: [ContentManagementController],
  providers: [ContentManagementService],
  exports: [ContentManagementService],
})
export class ContentManagementModule {}
