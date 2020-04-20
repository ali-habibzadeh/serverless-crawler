import { App, Construct, Stack, StackProps } from "@aws-cdk/core";

import { Text2SpeechApi } from "./text2S-api/text2S-api";

export class Text2SStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }
  public alexaApi = new Text2SpeechApi(this);
}

const app = new App();
new Text2SStack(app, "my-alexa-app");
app.synth();
