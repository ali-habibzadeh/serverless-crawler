import { APIGatewayProxyEvent } from "aws-lambda";

export class StartCrawlHandler {
  constructor(private event: APIGatewayProxyEvent) {}

  public async handle(): Promise<string | null> {
    return this.event.body;
  }
}
