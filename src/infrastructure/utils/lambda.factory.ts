import * as path from "path";

import { Code, Function as Fn, Runtime } from "@aws-cdk/aws-lambda";
import { Construct } from "@aws-cdk/core";

import { LambdaHandlers } from "../../handlers-list";

export function createLambda(scope: Construct, id: string, functionName: string, handler: LambdaHandlers): Fn {
  return new Fn(scope, id, {
    functionName,
    runtime: Runtime.NODEJS_12_X,
    code: Code.fromAsset(path.join(__dirname.substring(0, __dirname.indexOf("dist") + 4))),
    handler: `index.${handler}`,
  });
}
