import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { GetRoleDetailResponseDTO, UpdateRoleRequestDTO } from '@repo/shared';
import {
  CreateRoleRequestDTO,
  GetRolesRequestDTO,
  ResWithPaginationDTO,
  GetRolesResponseDTO,
  GetRoleByNameResponseDTO,
} from '@repo/shared';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  // get table data
  @Get()
  @UseGuards(AuthGuard)
  getRoles(
    @Query() getRolesRequestDTO: GetRolesRequestDTO,
  ): Promise<ResWithPaginationDTO<GetRolesResponseDTO[]>> {
    console.log('getRolesRequestDTO', getRolesRequestDTO);
    return this.rolesService.getRoles(getRolesRequestDTO);
  }

  // get single role by id
  @Get('/id/:id')
  @UseGuards(AuthGuard)
  getRoleById(@Param('id') id: string) {
    return this.rolesService.getRoleById(id);
  }

  @Get('/name/:name')
  @UseGuards(AuthGuard)
  getRoleByName(
    @Param('name') name: string,
  ): Promise<GetRoleByNameResponseDTO> {
    return this.rolesService.getRoleByName(name);
  }

  // create role
  @Post()
  @UseGuards(AuthGuard)
  createRole(@Body() createRoleDto: CreateRoleRequestDTO) {
    return this.rolesService.createRole(createRoleDto);
  }

  // update role
  @Patch()
  @UseGuards(AuthGuard)
  updateRole(@Body() updateRes: UpdateRoleRequestDTO) {
    return this.rolesService.updateRole(updateRes);
  }
  // delete role
  @Delete('/:id')
  @UseGuards(AuthGuard)
  deleteRole(@Param('id') id: string) {
    return this.rolesService.deleteRole(id);
  }
  // switch role status
  @Patch('/status/:id')
  @UseGuards(AuthGuard)
  roleStatus(@Param('id') id: string) {
    return this.rolesService.roleStatus(id);
  }

  @Get('/detail/:id')
  @UseGuards(AuthGuard)
  getRoleDetail(@Param('id') id: string): Promise<GetRoleDetailResponseDTO> {
    return this.rolesService.roleDetail(id);
  }
}
