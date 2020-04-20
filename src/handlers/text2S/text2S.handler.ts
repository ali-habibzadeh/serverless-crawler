import { PollyService } from "../../core/polly/polly.service";
import { Handler } from "../base.handler";

export class TextToSpeechHandler extends Handler {
  private bucketName = process.env.messageBucketName;
  private message = this.event.queryStringParameters!.message;
  private polly = PollyService.getInstance();

  constructor(protected event: AWSLambda.APIGatewayEvent) {
    super(event);
  }

  public async respond(): Promise<any> {
    if (this.bucketName) {
      const pollyOutput = await this.polly
        .startSpeechSynthesisTask({
          Text: this.message,
          OutputFormat: "mp3",
          OutputS3BucketName: this.bucketName,
          VoiceId: "Kimberly",
        })
        .promise();
      return pollyOutput.$response;
    }
    throw new Error(`Missing Bucket to write message to`);
  }
}
