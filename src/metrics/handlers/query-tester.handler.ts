import { S3, ApiGatewayManagementApi } from "aws-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";
import { appConfig } from "../../config/config.service";
import { SelectObjectContentOutput, Object as S3Object } from "aws-sdk/clients/s3";

export class QueryTesterHandler {
  private s3 = new S3();
  constructor(private event: APIGatewayProxyEvent) {}

  public async handle(): Promise<any> {
    const {
      requestContext: { routeKey }
    } = this.event;
    switch (routeKey) {
      case "$connect":
        return this.postToConnection("Hello from lambda $connect");
      case "$disconnect":
        return this.postToConnection("Hello from lambda $disconnect");
      case "$default":
        return this.postToConnection("Hello from lambda $default");
      default:
        throw new Error(`invalid route ${routeKey}`);
    }
  }

  private postToConnection(data: Buffer | string): Promise<any> {
    const endpoint = "pse27qqusf.execute-api.us-east-1.amazonaws.com/prod";
    const manager = new ApiGatewayManagementApi({ endpoint });
    return manager
      .postToConnection({
        ConnectionId: this.event.requestContext.connectionId || "",
        Data: data
      })
      .promise();
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
