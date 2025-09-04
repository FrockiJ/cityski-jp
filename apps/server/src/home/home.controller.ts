import { Controller, Get } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('/home')
export class HomeController {
  constructor(private homeService: HomeService) {}

  // 取得廣告橫幅
  @Get('/ad-banner')
  async getAdBanner() {
    return this.homeService.getAdBanner();
  }

  // 取得影片
  @Get('/videos')
  async getVideos() {
    return this.homeService.getVideos();
  }
}
