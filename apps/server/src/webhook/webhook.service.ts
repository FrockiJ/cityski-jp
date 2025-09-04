import { Injectable } from '@nestjs/common';
import {
  LineWebhooksResponse,
  LineWebhookType,
  MemberLinkedLineOA,
  MemberLinkedLineOAEnum,
} from '@repo/shared';
import { MembersService } from 'src/members/members.service';

@Injectable()
export class WebhookService {
  constructor(private readonly memberService: MembersService) {}

  async updateLineOAStatus(
    event: LineWebhooksResponse,
  ): Promise<MemberLinkedLineOAEnum> {
    let updatedLineOAStatus: MemberLinkedLineOAEnum;
    console.log('Event Type:', event.type);

    const lineId = event.source.userId;

    // change line_oa status for member in DB based on their actions
    // 1. follow account, we set it to true
    if (event.type === LineWebhookType.FOLLOW) {
      updatedLineOAStatus = MemberLinkedLineOA.TRUE;
    }

    // 2. unfollow account, we set it to false
    if (event.type === LineWebhookType.UNFOLLOW) {
      updatedLineOAStatus = MemberLinkedLineOA.FALSE;
    }

    const member = await this.memberService.findMemberByLineId(lineId);

    const updatedMember = await this.memberService.updateExistingMemberById(
      member.id,
      {
        lineOa: updatedLineOAStatus,
      },
    );

    console.log(
      'Checked updated member exists for LineOA Status:',
      updatedMember,
    );

    if (!updatedMember) return MemberLinkedLineOA.FALSE;
    return MemberLinkedLineOA.TRUE;
  }
}
