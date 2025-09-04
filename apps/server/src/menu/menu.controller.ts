import { Controller, Get, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  getMenu() {
    return this.menuService.getMenu();
  }
}
