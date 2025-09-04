import { forwardRef, Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { MembersModule } from 'src/members/members.module';

@Module({
  imports: [forwardRef(() => MembersModule)],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
