import { Polly } from "aws-sdk";

export class PollyService {
  private static instance: Polly;
  private static region = process.env.region;

  private constructor() {}

  public static getInstance(): Polly {
    if (!PollyService.instance) {
      PollyService.instance = new Polly({ region: PollyService.region, logger: console });
    }
    return PollyService.instance;
  }
}
