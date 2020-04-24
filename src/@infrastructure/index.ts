import { App, CfnOutput, Construct, Stack, StackProps } from "@aws-cdk/core";

import { SpeechApi } from "./speech-api/speech-api";

export const mainStackName = "speech-app";

export class SpeechStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }
  public alexaApi = new SpeechApi(this);
  public regionOutput = new CfnOutput(this, "region", { value: this.region });
}

console.log("GITHUB_REF", process.env.GITHUB_REF);

const app = new App();
new SpeechStack(app, mainStackName);
app.synth();
