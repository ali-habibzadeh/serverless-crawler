import { App, Construct, Stack, StackProps } from "@aws-cdk/core";

import { SpeechApi } from "./speech-api/speech-api";

export const mainStackName = "speech-app";

export class SpeechStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }
  public alexaApi = new SpeechApi(this);
}

const app = new App();
new SpeechStack(app, mainStackName);
app.synth();
