import { EventBridge } from "aws-sdk";

export class EventBridgeService {
  private static instance: EventBridge;
  private static region = process.env.region;

  private constructor() {}

  public static getInstance(): EventBridge {
    if (!EventBridgeService.instance) {
      EventBridgeService.instance = new EventBridge({ region: EventBridgeService.region, logger: console });
    }
    return EventBridgeService.instance;
  }
}
