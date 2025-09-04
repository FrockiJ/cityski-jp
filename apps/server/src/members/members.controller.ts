import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CustomRequest } from 'src/shared/interfaces/custom-request';
import { ClientAuthGuard } from 'src/guards/client-auth.guard';
import {
  GetMembersRequestDto,
  MemberResponseDto,
  ResWithPaginationDTO,
  UpdateMemberProfileRequestDto,
  UpdateMemberRequestDTO,
} from '@repo/shared';
import { AuthGuard } from 'src/guards/auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('member')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  /********************************************
   *              -- CLIENT --                *
   ********************************************/

  /**
   * Standard member profile update
   **/
  @UseGuards(ClientAuthGuard)
  @Patch('/profile')
  async updateExistingMemberProfile(
    @Body() body: UpdateMemberProfileRequestDto,
    @Req() request: CustomRequest,
  ) {
    const id = request['user'].sub;
    console.log('Member ID:', id);
    return this.membersService.updateExistingMemberById(id, body);
  }

  /**
   * Change member password
   **/
  @UseGuards(ClientAuthGuard)
  @Patch('/change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() request: CustomRequest,
  ) {
    const id = request['user'].sub;
    return this.membersService.changePassword(id, changePasswordDto);
  }

  /********************************************
   *              -- ADMIN  --                *
   ********************************************/

  /**
   * Get all members.
   **/
  @UseGuards(AuthGuard)
  @Get()
  getMembers(
    @Query() getMembersRequestDto: GetMembersRequestDto,
  ): Promise<ResWithPaginationDTO<MemberResponseDto[]>> {
    return this.membersService.getMembers(getMembersRequestDto);
  }

  /**
   * Get a single member's detail data by ID.
   **/
  @UseGuards(AuthGuard)
  @Get(':id')
  getMemberDetailsById(@Param('id') id: string) {
    return this.membersService.getMemberDetailsById(id);
  }

  /**
   * Standard member update via provided ID by an Admin user.
   **/
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateExistingMemberById(
    @Param('id') id: string,
    @Body() body: UpdateMemberRequestDTO,
  ) {
    return this.membersService.updateExistingMemberById(id, body);
  }

  /**
   * Toggle a member's status.
   * Active (1) / Inactive (0)
   **/
  @UseGuards(AuthGuard)
  @Patch(':id/status')
  async toggleMemberStatus(
    @Param('id') id: string,
  ): Promise<MemberResponseDto> {
    return this.membersService.toggleMemberStatus(id);
  }

  /**
   * Deactivate an existing member's system access by soft delete.
   **/
  @UseGuards(AuthGuard)
  @Patch(':id/deactivate')
  async deactivateMember(@Param('id') id: string): Promise<MemberResponseDto> {
    return this.membersService.deactivateMember(id);
  }

  /**
   * Activates an existing member's access.
   **/
  @UseGuards(AuthGuard)
  @Patch(':id/start')
  async activateMember(@Param('id') id: string): Promise<MemberResponseDto> {
    return this.membersService.activateMember(id);
  }
}
