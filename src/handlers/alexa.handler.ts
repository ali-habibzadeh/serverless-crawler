import { S3Service } from "../core/s3/s3.service";

export class AlexaHandler {
  private bucketArn = process.env.messageBucketName;
  private s3 = S3Service.getInstance();

  constructor(private event: AWSLambda.APIGatewayEvent) {}

  public async writeMessaage(): Promise<string> {
    if (this.bucketArn) {
      const body = this.event.queryStringParameters!.message;
      await this.s3.putObject({ Body: body, Bucket: this.bucketArn, Key: "MyMessage" }).promise();
      return `Saved: ${body}`;
    }
    throw new Error(`Missing Bucket to write message to`);
  }
}
