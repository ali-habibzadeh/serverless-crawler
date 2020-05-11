import { Page, Response } from "puppeteer-core";

import { CatchAll } from "../core/utils/catch-all";
import { MetricNames, metricsContainers as metrics } from "../metrics/metrics-list";
import { BrowserService } from "./config/browser.service";
import { PageRequestHandler } from "./config/page-request.handler";

export class PageRenderService {
  private page!: Page;

  constructor(private url: string) {}

  @CatchAll()
  public async getPageRenderMetrics(): Promise<Record<MetricNames, any>> {
    const response = await this.getResponse();
    const results = await Promise.all(metrics.map((metric) => new metric(this.page, response).getMetrics()));
    await this.page.close({ runBeforeUnload: false });
    return results.flat(1).reduce((obj, metric) => ({ ...obj, ...metric }));
  }

  @CatchAll()
  private async getResponse(): Promise<Response | null> {
    this.page = await BrowserService.getBrowser().newPage();
    await this.setPageHandlers();
    return this.page.goto(this.url);
  }

  private async setPageHandlers(): Promise<void> {
    await this.page.setRequestInterception(true);
    this.page.on("request", async (request) => new PageRequestHandler(request).handle());
  }
}
