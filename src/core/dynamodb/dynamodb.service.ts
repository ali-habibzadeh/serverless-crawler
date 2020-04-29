import { DynamoDB } from "aws-sdk";

import { DataMapper } from "@aws/dynamodb-data-mapper";

import { ConfigService } from "../../config/config.service";

export class DynamodbService {
  private static instance: DataMapper;
  private static region = ConfigService.getInstance().environment.region;
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
