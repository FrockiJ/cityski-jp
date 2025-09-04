import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  CreateUserRequestDTO,
  GetRoleOptionsResponseDTO,
  GetUserByEmailResponseDTO,
  UpdateUserRequestDTO,
  GetUsersRequestDTO,
  GetUsersResponseDTO,
  ResWithPaginationDTO,
} from '@repo/shared';
import { CustomRequest } from 'src/shared/interfaces/custom-request';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  getUsers(
    @Query() getUsersRequestDTO: GetUsersRequestDTO,
  ): Promise<ResWithPaginationDTO<GetUsersResponseDTO[]>> {
    return this.usersService.getUsers(getUsersRequestDTO);
  }

  @Get('/email/:email')
  @UseGuards(AuthGuard)
  getUserByEmail(
    @Param('email') email: string,
  ): Promise<GetUserByEmailResponseDTO> {
    return this.usersService.getUserByEmail(email);
  }

  @Post()
  @UseGuards(AuthGuard)
  createUser(
    @Body() body: CreateUserRequestDTO,
    @Req() request: CustomRequest,
  ) {
    const userId = request['user'].sub;
    return this.usersService.createUser(body, userId);
  }

  @Patch()
  @UseGuards(AuthGuard)
  updateUser(
    @Body() body: UpdateUserRequestDTO,
    @Req() request: CustomRequest,
  ) {
    const userId = request['user'].sub;
    return this.usersService.updateUser(body, userId);
  }

  // delete role
  @Delete('/:id')
  @UseGuards(AuthGuard)
  deleteUser(@Param('id') id: string, @Req() request: CustomRequest) {
    const userId = request['user'].sub;
    return this.usersService.deleteUser(id, userId);
  }

  // switch user status
  @Patch('/status/:id')
  @UseGuards(AuthGuard)
  userStatus(@Param('id') id: string) {
    return this.usersService.userStatus(id);
  }

  @Get('/role-options')
  @UseGuards(AuthGuard)
  roleOptions(): Promise<GetRoleOptionsResponseDTO> {
    return this.usersService.roleOptions();
  }

  @UseGuards(AuthGuard)
  @Get('/roles-and-departments')
  rolesTest(@Req() request: CustomRequest) {
    const roles = request['roles'] as [string];
    const departments = request['departments'] as [string];

    return this.usersService.rolesTest(roles, departments);
  }
}
