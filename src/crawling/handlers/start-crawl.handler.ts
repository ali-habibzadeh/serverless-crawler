import { APIGatewayProxyEvent } from "aws-lambda";

import { crawlUrlStore } from "../url-processing/crawl-url.model";
import { customMetricsService } from "../../metrics/custom-metrics/custom-metrics.service";

export class StartCrawlHandler {
  constructor(private event: APIGatewayProxyEvent) {}

  public async handle(): Promise<string> {
    await customMetricsService.warmUpCache();
    await crawlUrlStore.put({ url: this.getUrl(), level: 0 }).exec();
    return "started";
  }

  private getUrl(): string {
    if (this.event.body) {
      const { url } = JSON.parse(this.event.body);
      return url;
    }
    throw new Error(`Invalid body: ${this.event.body}`);
  }
}
