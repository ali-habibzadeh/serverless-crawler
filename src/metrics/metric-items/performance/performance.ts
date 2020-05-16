import { Page, Response } from "puppeteer-core";

import { Schema } from "@aws-cdk/aws-glue";

import { CDPSessionClient } from "../../../page-rendering/cdp/cdp-session-client";
import { MetricContainer } from "../../base-types/metric-container";
import { MetricNames } from "../../metrics-list";

export class WebPerformance extends MetricContainer {
  constructor(protected page: Page, response: Response | null) {
    super(page, response);
  }

  private cdpSession = new CDPSessionClient(this.page);

  public columns = [
    { name: MetricNames.FCP, type: Schema.INTEGER, isGlueColumn: true },
    { name: MetricNames.PageResourcesCount, type: Schema.INTEGER, isGlueColumn: true }
  ];

  private extractPaintMetrics = () => {
    const perf = performance.getEntries().filter((entry) => entry.entryType === "paint");
    return JSON.stringify(perf);
  };

  public async getMetrics(): Promise<Record<string, number>[]> {
    return [
      {
        [this.columns[0].name]: await this.getFirstContentfulPaint(),
        [this.columns[1].name]: await this.getResourceTreeCount()
      }
    ];
  }

  private async getFirstContentfulPaint(): Promise<number> {
    const paintEntries: PerformanceEntry[] = JSON.parse(await this.page.evaluate(this.extractPaintMetrics));
    const fcp = paintEntries.find((entry) => entry.name === "first-contentful-paint")?.startTime || 0;
    return Math.round(fcp);
  }

  private async getResourceTreeCount(): Promise<number> {
    await this.cdpSession.startSession();
    const resourceTree = await this.cdpSession.getPageResourceTree();
    return resourceTree.frameTree.resources.length;
  }
}
