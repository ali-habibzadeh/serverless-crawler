import { Page, Response } from "puppeteer-core";

import { MetricNames, coreMetrics } from "../metrics/metrics-list";
import { BrowserService } from "./config/browser.service";
import { PageRequestHandler } from "./config/page-request.handler";
import { CustomMetrics } from "../metrics/custom-metrics/custom-metric.container";
import { customMetricsService } from "../metrics/custom-metrics/custom-metrics.service";
import { CDPSessionClient } from "./cdp/cdp-session-client";

export class PageRenderService {
  private page!: Page;
  private cdp!: CDPSessionClient;

  constructor(private url: string) {}

  public async getPageRenderMetrics(): Promise<Record<MetricNames, any>> {
    const response = await this.getResponse();
    await customMetricsService.warmUpCache();
    const list = [...coreMetrics, CustomMetrics];
    const results = await Promise.all(list.map(metric => new metric(this.page, response, this.cdp).getMetrics()));
    await this.page.close();
    return results.flat().reduce((obj, metric) => ({ ...obj, ...metric }));
  }

  private async getResponse(): Promise<Response | null> {
    this.page = await BrowserService.getBrowser().newPage();
    await this.createCdp();
    await this.setPageHandlers();
    return this.page.goto(this.url);
  }

  private async createCdp(): Promise<void> {
    if (!this.page) {
      throw new Error("Create page before creating cdp session");
    }
    this.cdp = new CDPSessionClient(this.page);
    await this.cdp.startSession();
    await this.cdp.disableServiceWorkers();
    await this.cdp.grantPermissions([]);
  }

  private async setPageHandlers(): Promise<void> {
    await this.page.setRequestInterception(true);
    this.page.on("request", async request => new PageRequestHandler(request).handle());
    this.page.on("dialog", dialog => dialog.dismiss());
  }
}
