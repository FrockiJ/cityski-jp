import { Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { CustomRequest } from 'src/shared/interfaces/custom-request';
import { LineWebhooksResponse } from '@repo/shared';

/**
 * Responsible for all Line webhooks that detect changes on line events for the
 * connected line provider.
 **/
@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}
  @Post('line')
  async handleLineWebhook(@Req() req: CustomRequest) {
    const events = req?.body?.events as LineWebhooksResponse[];
    if (!events) return;

    console.log('webhook called, events:', events);

    let updatedLineOAStatus: string;

    for (const event of events) {
      updatedLineOAStatus = await this.webhookService.updateLineOAStatus(event);
    }

    req.message = `Member's Line OA linked status is now: ${updatedLineOAStatus} `;
    return updatedLineOAStatus;
  }
}
