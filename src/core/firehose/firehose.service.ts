import { Firehose } from "aws-sdk";

import { appConfig } from "../../config/config.service";

export class FirehoseService {
  private static instance: Firehose;
  private static region = appConfig.region;

  private constructor() {}

  public static getInstance(): Firehose {
    if (!FirehoseService.instance) {
      FirehoseService.instance = new Firehose({ region: FirehoseService.region, logger: console });
    }
    return FirehoseService.instance;
  }
}
