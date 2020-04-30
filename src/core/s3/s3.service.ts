import { S3 } from "aws-sdk";

import { appConfig } from "../../config/config.service";

export class S3Service {
  private static instance: S3;
  private static region = appConfig.region;

  private constructor() {}

  public static getInstance(): S3 {
    if (!S3Service.instance) {
      S3Service.instance = new S3({ region: S3Service.region, logger: console });
    }
    return S3Service.instance;
  }
}
