import { Function as Fn } from "@aws-cdk/aws-lambda";
import { Construct, Stack } from "@aws-cdk/core";
import { CfnApiV2, CfnRouteV2, CfnIntegrationV2 } from "@aws-cdk/aws-apigateway/lib/apigatewayv2";
import { PolicyStatement, Effect, Role, ServicePrincipal } from "@aws-cdk/aws-iam";

export class QueryTesterSocketsApi extends Construct {
  constructor(parent: Construct, id: string, private queryTesterHandler: Fn) {
    super(parent, id);
    this.configure();
  }

  public api = new CfnApiV2(this, "queryTesterSocketsApi", {
    name: "WDISSockets",
    protocolType: "WEBSOCKET",
    routeSelectionExpression: "$request.body.message"
  });

  private role = new Role(this, "roleapigatewaysocketapi", {
    assumedBy: new ServicePrincipal("apigateway.amazonaws.com")
  });

  private integration = new CfnIntegrationV2(this, "apigatewayintegrationsocketconnect", {
    apiId: this.api.ref,
    integrationType: "AWS_PROXY",
    integrationUri: `arn:aws:apigateway:
      ${Stack.of(this).region}
      :lambda:path/2015-03-31/functions/
      ${this.queryTesterHandler.functionArn}
      /invocations`,
    credentialsArn: this.role.roleArn
  });

  private connectRoute = new CfnRouteV2(this, "QueryTesterSocketsApiConnectRoute", {
    apiId: this.api.ref,
    routeKey: "$connect",
    authorizationType: "NONE",
    operationName: "ConnectRoute",
    target: `integrations/${this.integration.ref}`
  });

  private disconnectRoute = new CfnRouteV2(this, "QueryTesterSocketsApiDisconnectRoute", {
    apiId: this.api.ref,
    routeKey: "$disconnect",
    authorizationType: "NONE",
    operationName: "DisconnectRoute",
    target: `integrations/${this.integration.ref}`
  });

  private messageRoute = new CfnRouteV2(this, "QueryTesterSocketsApiMessageRoute", {
    apiId: this.api.ref,
    routeKey: "$default",
    authorizationType: "NONE",
    operationName: "SendRoute",
    target: `integrations/${this.integration.ref}`
  });

  private configure(): void {
    const policy = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [this.queryTesterHandler.functionArn],
      actions: ["lambda:InvokeFunction"]
    });
    this.role.addToPolicy(policy);
  }
}
