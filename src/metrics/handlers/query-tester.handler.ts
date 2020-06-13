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
    const { routeKey } = this.event.requestContext;
    if (routeKey !== "$default") return;
    const list = await this.s3.listObjects({ Bucket: this.bucket }).promise();
    if (!list.Contents) {
      return;
    }
    const stream = await this.queryObject(list.Contents[0]);
    stream.on("data", async (event: any) => {
      const records = event.Records;
      if (records) {
        await this.postToConnection(records.Payload.toString());
      }
    });
  }

  private async postToConnection(data: Buffer | string): Promise<void> {
    await this.manager
      .postToConnection({
        ConnectionId: this.event.requestContext.connectionId || "",
        Data: data
      })
      .promise();
  }

  private async queryObject(object: S3Object): Promise<any> {
    const { Payload: eventStream } = await this.s3
      .selectObjectContent({
        Bucket: this.bucket,
        ExpressionType: "SQL",
        Expression: this.getQuery(),
        InputSerialization: { Parquet: {} },
        OutputSerialization: { JSON: {} },
        Key: object.Key || ""
      })
      .promise();
    return eventStream;
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
