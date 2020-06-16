import { S3, ApiGatewayManagementApi } from "aws-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";
import { appConfig } from "../../config/config.service";
import { Object as S3Object } from "aws-sdk/clients/s3";

export class QueryTesterHandler {
  private s3 = new S3();
  private manager!: ApiGatewayManagementApi;
  private bucket = appConfig.crawlDataBucketName;
  constructor(private event: APIGatewayProxyEvent) {
    const {
      requestContext: { domainName, stage }
    } = this.event;
    this.manager = new ApiGatewayManagementApi({ endpoint: `https://${domainName}/${stage}` });
  }

  public async handle(): Promise<any> {
    if (this.event.requestContext.routeKey !== "$default") return;
    const latest = await this.getLatestObject();
    const events = await this.queryObject(latest, this.getQuery());
    for await (const event of events) {
      const payload = event.Records ? event.Records.Payload.toString("utf8") : "No records.";
      await this.postToConnection(payload);
    }
  }

  private async getLatestObject(): Promise<S3Object> {
    const { Contents } = await this.s3.listObjectsV2({ Bucket: this.bucket }).promise();
    if (Contents) {
      return Contents.sort((a, b) => b.LastModified!.getDate() - a.LastModified!.getDate())[0];
    }
    throw new Error("No Crawl data found in bucket");
  }

  private async postToConnection(data: Buffer | string): Promise<void> {
    const connectionId = this.event.requestContext.connectionId || "";
    await this.manager.postToConnection({ ConnectionId: connectionId, Data: data }).promise();
  }

  private async queryObject(object: S3Object, query: string): Promise<any> {
    const { Payload: streamEvents } = await this.s3
      .selectObjectContent({
        Bucket: this.bucket,
        ExpressionType: "SQL",
        Expression: query,
        InputSerialization: { Parquet: {} },
        OutputSerialization: { JSON: {} },
        Key: object.Key || ""
      })
      .promise();
    return streamEvents;
  }

  private getQuery(): string {
    const body = this.event.body;
    if (body) {
      const { query } = JSON.parse(body);
      return query;
    }
    throw new Error(`Invalid body: ${this.event.body}`);
  }
}
