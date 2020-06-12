import { S3 } from "aws-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";
import { appConfig } from "../../config/config.service";

export class QueryTesterHandler {
  private s3 = new S3();
  constructor(private event: APIGatewayProxyEvent) {}

  public async handle(): Promise<any> {}
}
