import { EventBridge } from "aws-sdk";

import { appConfig } from "../../config/config.service";

export class EventBridgeService {
  private static instance: EventBridge;
  private static region = appConfig.region;

  private constructor() {}

  public static getInstance(): EventBridge {
    if (!EventBridgeService.instance) {
      EventBridgeService.instance = new EventBridge({ region: EventBridgeService.region, logger: console });
    }
    return EventBridgeService.instance;
  }
}
