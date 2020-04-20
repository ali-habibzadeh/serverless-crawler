export abstract class Handler {
  constructor(protected event: AWSLambda.APIGatewayEvent) {}

  abstract async respond(): Promise<string>;
}
