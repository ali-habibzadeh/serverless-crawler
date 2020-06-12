import { Function as Fn } from "@aws-cdk/aws-lambda";
import { Construct, Stack, ConcreteDependable } from "@aws-cdk/core";
import {
  CfnApiV2,
  CfnRouteV2,
  CfnIntegrationV2,
  CfnDeploymentV2,
  CfnStageV2
} from "@aws-cdk/aws-apigateway/lib/apigatewayv2";
import { PolicyStatement, Effect, Role, ServicePrincipal } from "@aws-cdk/aws-iam";

export class QueryTesterSocketsApi extends Construct {
  constructor(parent: Construct, id: string, private queryTesterHandler: Fn) {
    super(parent, id);
    this.configurePermissions();
    this.configureRoutes();
  }

  public api = new CfnApiV2(this, "queryTesterSocketsApi", {
    name: "QueryTesterSocketsApi",
    protocolType: "WEBSOCKET",
    routeSelectionExpression: "$request.body.message"
  });

  private role = new Role(this, "roleapigatewaysocketapi", {
    assumedBy: new ServicePrincipal("apigateway.amazonaws.com")
  });

  private integration = new CfnIntegrationV2(this, "apigatewayintegrationsocketconnect", {
    apiId: this.api.ref,
    integrationType: "AWS_PROXY",
    integrationUri: `arn:aws:apigateway:${Stack.of(this).region}:lambda:path/2015-03-31/functions/${
      this.queryTesterHandler.functionArn
    }/invocations`,
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

  private deployoment = new CfnDeploymentV2(this, "QueryTesterSocketsApiDeployment", {
    apiId: this.api.ref
  });

  private prodStage = new CfnStageV2(this, "QueryTesterSocketsApiProdStage", {
    apiId: this.api.ref,
    deploymentId: this.deployoment.ref,
    stageName: "prod",
    defaultRouteSettings: {
      throttlingBurstLimit: 500,
      throttlingRateLimit: 1000
    }
  });

  private configurePermissions(): void {
    const policy = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [this.queryTesterHandler.functionArn],
      actions: ["lambda:InvokeFunction"]
    });
    this.role.addToPolicy(policy);
  }

  private configureRoutes(): void {
    const routes = new ConcreteDependable();
    routes.add(this.connectRoute);
    routes.add(this.messageRoute);
    routes.add(this.disconnectRoute);
    this.api.node.addDependency(routes);
  }
}
