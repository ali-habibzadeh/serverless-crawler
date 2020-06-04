import { Page, Response } from "puppeteer-core";

import { Schema } from "@aws-cdk/aws-glue";

import { CDPSessionClient } from "../../../page-rendering/cdp/cdp-session-client";
import { BaseMetricContainer } from "../../base-types/base-metric-container";
import { MetricNames } from "../../metrics-list";
import { getLargestContentfulPaint } from "./largest-contentful-paint";

export class WebPerformance extends BaseMetricContainer {
  private cdpSession = new CDPSessionClient(this.page);

  constructor(protected page: Page, response: Response | null) {
    super(page, response);
  }

  public columns = [
    { name: MetricNames.FirstContentfulPaint, type: Schema.INTEGER, isGlueColumn: true },
    { name: MetricNames.PageResourcesCount, type: Schema.INTEGER, isGlueColumn: true },
    { name: MetricNames.LargestContentfulPaint, type: Schema.INTEGER, isGlueColumn: true }
  ];

  private extractPaintMetrics = () => {
    const perf = performance.getEntries().filter(entry => entry.entryType === "paint");
    return JSON.stringify(perf);
  };

  public async getMetrics(): Promise<Record<string, number>[]> {
    return [
      {
        [this.columns[0].name]: await this.getFirstContentfulPaint(),
        [this.columns[1].name]: await this.getResourceTreeCount(),
        [this.columns[2].name]: await this.getLargestContentfulPaint()
      }
    ];
  }

  private async getFirstContentfulPaint(): Promise<number> {
    const paintEntries: PerformanceEntry[] = JSON.parse(await this.page.evaluate(this.extractPaintMetrics));
    const fcp = paintEntries.find(entry => entry.name === "first-contentful-paint")?.startTime || 0;
    return Math.round(fcp);
  }

  private async getResourceTreeCount(): Promise<number> {
    await this.cdpSession.startSession();
    const resourceTree = await this.cdpSession.getPageResourceTree();
    return resourceTree.frameTree.resources.length;
  }

  private async getLargestContentfulPaint(): Promise<number> {
    return this.page.evaluate(getLargestContentfulPaint);
  }
}
