import { EventBridge } from "aws-sdk";

import { ConfigService } from "../../config/config.service";

export class EventBridgeService {
  private static instance: EventBridge;
  private static region = ConfigService.getInstance().environment.region;

  private constructor() {}

  public static getInstance(): EventBridge {
    if (!EventBridgeService.instance) {
      EventBridgeService.instance = new EventBridge({ region: EventBridgeService.region, logger: console });
    }
    return EventBridgeService.instance;
  }
}
