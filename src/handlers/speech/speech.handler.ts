import { StartSpeechSynthesisTaskInput } from "aws-sdk/clients/polly";

import { ConfigService } from "../../config/config.service";
import { PollyService } from "../../core/polly/polly.service";
import { Handler } from "../base.handler";

export class SpeechHandler extends Handler {
  private bucketName = ConfigService.getInstance().environment.speechBucketName;
  private message = this.event.queryStringParameters!.message;
  private polly = PollyService.getInstance();
  private synthesisInput: StartSpeechSynthesisTaskInput = {
    Text: this.message,
    OutputFormat: "mp3",
    OutputS3BucketName: this.bucketName || "",
    VoiceId: "Kimberly",
  };

  constructor(protected event: AWSLambda.APIGatewayEvent) {
    super(event);
  }

  public async respond(): Promise<any> {
    if (this.bucketName) {
      const pollyOutput = await this.polly.startSpeechSynthesisTask(this.synthesisInput).promise();
      return pollyOutput.$response.data;
    }
    throw new Error(`Missing Bucket to write message to`);
  }
}
