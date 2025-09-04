import { LineWebhookTypeEnum } from "src/constants/enums";

export type LineWebhooksResponse = {
  type: LineWebhookTypeEnum;
  source: {
    userId: string;
  };
};
