import { Page, Response } from "puppeteer-core";

import { MetricNames, metricsContainers } from "../metrics/metrics-list";
import { BrowserService } from "./config/browser.service";
import { PageRequestHandler } from "./config/page-request.handler";
import { CustomMetricsContainer } from "../metrics/custom-metrics/custom-metric.container";
import { customMetricsService } from "../metrics/custom-metrics/custom-metrics.service";

export class PageRenderService {
  private page!: Page;

  constructor(private url: string) {}

  public async getPageRenderMetrics(): Promise<Record<MetricNames, any>> {
    const response = await this.getResponse();
    await customMetricsService.warmUpCache();
    const list = [...metricsContainers, CustomMetricsContainer];
    const results = await Promise.all(list.map(metric => new metric(this.page, response).getMetrics()));
    await this.page.close();
    return results.flat(1).reduce((obj, metric) => ({ ...obj, ...metric }));
  }

  private async getResponse(): Promise<Response | null> {
    await BrowserService.createBrowser();
    this.page = await BrowserService.getBrowser().newPage();
    await this.setPageHandlers();
    return this.page.goto(this.url);
  }

  private async setPageHandlers(): Promise<void> {
    await this.page.setRequestInterception(true);
    this.page.on("request", async request => new PageRequestHandler(request).handle());
  }
}
