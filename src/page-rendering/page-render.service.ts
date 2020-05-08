import { Page, Response } from "puppeteer-core";

import { MetricNames, metricsContainers as metrics } from "../metrics/metrics-list";
import { BrowserService } from "./config/browser.service";
import { PageRequestHandler } from "./config/page-request.handler";

export class PageRenderService {
  private page!: Page;

  constructor(private url: string) {}

  public async getPageRenderMetrics(): Promise<Record<MetricNames, any>> {
    const response = await this.getResponse();
    const results = await Promise.all(metrics.map((metric) => new metric(this.page, response).getMetrics()));
    await BrowserService.browser.close();
    return results.flat(1).reduce((obj, metric) => ({ ...obj, ...metric }));
  }

  private async getResponse(): Promise<Response | null> {
    await BrowserService.getBrowser();
    this.page = await BrowserService.browser.newPage();
    await this.setPageHandlers();
    return this.page.goto(this.url);
  }

  private async setPageHandlers(): Promise<void> {
    await this.page.setRequestInterception(true);
    this.page.on("request", async (request) => new PageRequestHandler(request).handle());
  }
}
