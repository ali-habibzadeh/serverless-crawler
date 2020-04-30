import { DynamoDB } from "aws-sdk";

import { DataMapper } from "@aws/dynamodb-data-mapper";

import { appConfig } from "../../config/config.service";

export class DynamodbService {
  private static instance: DataMapper;
  private static region = appConfig.region;
  public static Converter = DynamoDB.Converter;

  private constructor() {}

  public static getInstance(): DataMapper {
    if (!DynamodbService.instance) {
      DynamodbService.instance = new DataMapper({
        client: new DynamoDB({ region: DynamodbService.region, logger: console }),
      });
    }
    return DynamodbService.instance;
  }
}
