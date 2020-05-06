import { Browser, launch, Page, Response } from "puppeteer-core";

import { CrawlMetrics } from "../metrics/metrics-list";
import { getLaunchOptions } from "./config/constants/launch-options";
import { PageRequestHandler } from "./config/page-request.handler";

export class PageRenderService {
  private browser!: Browser;
  private page!: Page;

  constructor(private url: string) {}

  public async getPageRenderMetrics(): Promise<Record<string, any>> {
    const response = await this.getResponse();
    const metrics = new CrawlMetrics().metricsList;
    const results = await Promise.all(metrics.map((metric) => new metric(this.page, response).getMetric()));
    await this.close();
    return results.reduce((obj, metric) => ({
      ...obj,
      ...metric,
    }));
  }

  private async getResponse(): Promise<Response | null> {
    this.browser = await launch(await getLaunchOptions());
    this.page = await this.browser.newPage();
    await this.setPageHandlers();
    return this.page.goto(this.url);
  }

  private async setPageHandlers(): Promise<void> {
    await this.page.setRequestInterception(true);
    this.page.on("request", async (request) => new PageRequestHandler(request).handle());
  }

  private async close(): Promise<void> {
    this.browser.disconnect();
  }
}
