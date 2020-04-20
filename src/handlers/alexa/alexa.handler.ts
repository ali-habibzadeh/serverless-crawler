import { S3Service } from "../../core/s3/s3.service";
import { Handler } from "../base.handler";

export class AlexaHandler extends Handler {
  private bucketArn = process.env.messageBucketName;
  private s3 = S3Service.getInstance();

  constructor(protected event: AWSLambda.APIGatewayEvent) {
    super(event);
  }

  public async respond(): Promise<string> {
    if (this.bucketArn) {
      const body = this.event.queryStringParameters!.message;
      await this.s3.putObject({ Body: body, Bucket: this.bucketArn, Key: "MyMessage" }).promise();
      return `Saved: ${body}`;
    }
    throw new Error(`Missing Bucket to write message to`);
  }
}
