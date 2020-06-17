import { Page, Response } from "puppeteer-core";
import { BaseMetricContainer } from "../base-types/base-metric-container";
import { customMetricsService } from "./custom-metrics.service";
import { CDPSessionClient } from "../../page-rendering/cdp/cdp-session-client";

export class CustomMetrics extends BaseMetricContainer {
  constructor(protected page: Page, protected response: Response | null, protected cdp: CDPSessionClient) {
    super(page, response, cdp);
  }
  public columns = [];

  public async getMetrics(): Promise<Record<string, any>[]> {
    const items = customMetricsService.getCustomMetrics();
    return Promise.all(
      items.map(async metric => {
        const { id, fn } = metric;
        return { [id]: await this.page.evaluate(fn) };
      })
    );
  }
}
