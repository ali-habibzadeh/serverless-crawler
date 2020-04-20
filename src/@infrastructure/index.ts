import { App, Construct, Stack, StackProps } from "@aws-cdk/core";

import { AlexaApi } from "./alexa-api/alexa-api";

export class AlexaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }
  public alexaApi = new AlexaApi(this);
}

const app = new App();
new AlexaStack(app, "my-alexa-app");
app.synth();
