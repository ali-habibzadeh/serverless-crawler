import { Page, Response } from "puppeteer-core";

import { MetricNames, coreMetrics } from "../metrics/metrics-list";
import { BrowserService } from "./config/browser.service";
import { PageRequestHandler } from "./config/page-request.handler";
import { CustomMetrics } from "../metrics/custom-metrics/custom-metric.container";
import { customMetricsService } from "../metrics/custom-metrics/custom-metrics.service";
import { CDPSessionClient } from "./cdp/cdp-session-client";

export class PageRenderService {
  private page!: Page;
  private cdpSession!: CDPSessionClient;

  constructor(private url: string) {}

  public async getPageRenderMetrics(): Promise<Record<MetricNames, any>> {
    const response = await this.getResponse();
    await customMetricsService.warmUpCache();
    const list = [...coreMetrics, CustomMetrics];
    const results = await Promise.all(
      list.map(metric => new metric(this.page, response, this.cdpSession).getMetrics())
    );
    await this.page.close();
    return results.flat(1).reduce((obj, metric) => ({ ...obj, ...metric }));
  }

  private async getResponse(): Promise<Response | null> {
    this.page = await (await BrowserService.getBrowser(this.url)).newPage();
    await this.configureCdpSession();
    await this.setPageHandlers();
    return this.page.goto(this.url, { waitUntil: "networkidle0", timeout: 15000 });
  }

  private async configureCdpSession(): Promise<void> {
    this.cdpSession = new CDPSessionClient(this.page);
    await this.cdpSession.startSession();
    await this.cdpSession.disableServiceWorkers();
  }

  private async setPageHandlers(): Promise<void> {
    await this.page.setRequestInterception(true);
    this.page.on("request", async request => new PageRequestHandler(request).handle());
  }
}
