import { S3 } from "aws-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";
import { appConfig } from "../../config/config.service";
import { SelectObjectContentOutput, Object as S3Object } from "aws-sdk/clients/s3";

export class QueryTesterHandler {
  private s3 = new S3();
  constructor(private event: APIGatewayProxyEvent) {}

  public async handle(): Promise<SelectObjectContentOutput[] | undefined> {
    const { Contents } = await this.s3.listObjects({ Bucket: appConfig.crawlDataBucketName }).promise();
    if (!Contents) {
      return [];
    }
    return Promise.all(Contents.map(async object => this.queryObject(object)));
  }

  private queryObject(object: S3Object): Promise<SelectObjectContentOutput> {
    return this.s3
      .selectObjectContent({
        Bucket: appConfig.crawlDataBucketName,
        ExpressionType: "SQL",
        Expression: this.getQuery(),
        InputSerialization: { Parquet: {} },
        OutputSerialization: { JSON: {} },
        Key: object.Key || ""
      })
      .promise();
  }

  private getQuery(): string {
    if (this.event.body) {
      const { query } = JSON.parse(this.event.body);
      return query;
    }
    throw new Error(`Invalid body: ${this.event.body}`);
  }
}
