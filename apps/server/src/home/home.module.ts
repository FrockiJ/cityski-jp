import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { HomeBanner } from 'src/contentManagement/entities/homeBanner.entity';
import { HomeVideo } from 'src/contentManagement/entities/homeVideo.entity';
import { File } from 'src/files/entities/file.entity';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([HomeBanner, HomeVideo, File]),
    forwardRef(() => UsersModule),
  ],
  controllers: [HomeController],
  providers: [HomeService],
  exports: [HomeService],
})
export class HomeModule {}
