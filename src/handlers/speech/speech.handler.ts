import { StartSpeechSynthesisTaskOutput } from "aws-sdk/clients/polly";

import { Handler } from "../../base.handler";
import { ConfigService } from "../../config/config.service";
import { EventBridgeService } from "../../core/event-bridge/event-bridge.service";
import { PollyService } from "../../core/polly/polly.service";

export class SpeechHandler extends Handler {
  private config = ConfigService.getInstance().environment;
  private bridge = EventBridgeService.getInstance();
  private polly = PollyService.getInstance();
  private synthesisInput = {
    Text: this.event.queryStringParameters.message,
    OutputFormat: "mp3",
    OutputS3BucketName: this.config.speechBucketName,
    VoiceId: "Kimberly",
  };

  constructor(protected event: any) {
    super(event);
  }

  public async respond(): Promise<StartSpeechSynthesisTaskOutput> {
    try {
      return this.polly.startSpeechSynthesisTask(this.synthesisInput).promise();
    } catch (e) {
      throw new Error(`Missing Bucket to write message to ${e}`);
    }
  }
}
