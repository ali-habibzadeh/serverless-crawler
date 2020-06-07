import { Page, Response } from "puppeteer-core";

import { Schema } from "@aws-cdk/aws-glue";

import { CDPSessionClient } from "../../../page-rendering/cdp/cdp-session-client";
import { BaseMetricContainer } from "../../base-types/base-metric-container";
import { MetricNames } from "../../metrics-list";

export class WebPerformance extends BaseMetricContainer {
  private cdpSession = new CDPSessionClient(this.page);

  constructor(protected page: Page, response: Response | null) {
    super(page, response);
  }

  public columns = [
    { name: MetricNames.PageResourcesCount, type: Schema.INTEGER, isGlueColumn: true },
    { name: MetricNames.LargestContentfulPaint, type: Schema.INTEGER, isGlueColumn: true }
  ];

  public async getMetrics(): Promise<Record<string, number>[]> {
    return [
      {
        [this.columns[0].name]: await this.getResourceTreeCount(),
        [this.columns[1].name]: await this.getLargestContentfulPaint()
      }
    ];
  }

  private async getResourceTreeCount(): Promise<number> {
    await this.cdpSession.startSession();
    const resourceTree = await this.cdpSession.getPageResourceTree();
    return resourceTree.frameTree.resources.length;
  }

  private async getLargestContentfulPaint(): Promise<number> {
    return this.page.evaluate(async () => {
      return new Promise<number>(resolve => {
        const po = new PerformanceObserver(list => {
          const lcpEntry = list.getEntries().find(e => e.entryType === "largest-contentful-paint");
          lcpEntry ? resolve(Math.round(lcpEntry.startTime)) : resolve(0);
        });
        po.observe({ type: "largest-contentful-paint", buffered: true });
      });
    });
  }
}
