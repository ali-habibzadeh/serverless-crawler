import { DynamoDB } from "aws-sdk";

import { appConfig } from "../../config/config.service";

export class DynamodbService {
  private static instance: DynamoDB;
  private static region = appConfig.region;
  public static Converter = DynamoDB.Converter;

  private constructor() {}

  public static getInstance(): DynamoDB {
    if (!DynamodbService.instance) {
      DynamodbService.instance = new DynamoDB({ region: DynamodbService.region, logger: console });
    }
    return DynamodbService.instance;
  }
}
