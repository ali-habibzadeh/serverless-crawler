import { S3 } from "aws-sdk";

export class AlexaHandler {
  private bucketArn = process.env.messageBucketName;
  private region = process.env.region;
  private s3 = new S3({ region: this.region });

  constructor(private event: AWSLambda.APIGatewayEvent) {}

  public async writeMessaage(): Promise<string> {
    if (this.bucketArn) {
      const body = this.event.queryStringParameters!.message;
      await this.put({ Body: body, Bucket: this.bucketArn, Key: "MyMessage" });
      return `Saved: ${body}`;
    }
    throw new Error(`Missing Bucket to write message to`);
  }

  private async put(input: S3.PutObjectRequest): Promise<S3.PutObjectOutput> {
    return this.s3.putObject(input).promise();
  }
}
