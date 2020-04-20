import * as path from "path";

import { Code, Function as Fn, Runtime, Tracing } from "@aws-cdk/aws-lambda";
import { Construct, Duration, Stack } from "@aws-cdk/core";

import { LambdaHandlers } from "../../handlers-list";

export class LambdaFactory {
  private lambdaCode = Code.fromAsset(path.join(__dirname.substring(0, __dirname.indexOf("dist") + 4)));

  constructor(private parent: Construct, private handler: LambdaHandlers, private environment?: {}) {}

  public getLambda(): Fn {
    return new Fn(this.parent, `Id-${this.handler}`, {
      functionName: `FnName-${this.handler}`,
      runtime: Runtime.NODEJS_12_X,
      code: this.lambdaCode,
      handler: `index.${this.handler}`,
      tracing: Tracing.ACTIVE,
      memorySize: 128,
      timeout: Duration.minutes(3),
      environment: {
        region: Stack.of(this.parent).region,
        account: Stack.of(this.parent).account,
        ...this.environment,
      },
    });
  }
}
