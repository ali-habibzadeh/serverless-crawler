import { Page, Response } from "puppeteer-core";

import { Schema } from "@aws-cdk/aws-glue";

import { BaseMetricContainer } from "../../base-types/base-metric-container";
import { MetricNames } from "../../metrics-list";

export class PageHtml extends BaseMetricContainer {
  constructor(protected page: Page, response: Response | null) {
    super(page, response);
  }

  public columns = [
    { name: MetricNames.PreRenderDom, type: Schema.STRING, isGlueColumn: false },
    { name: MetricNames.PostRenderDom, type: Schema.STRING, isGlueColumn: false }
  ];

  public async getMetrics(): Promise<Record<string, any>[]> {
    return [
      {
        [this.columns[0].name]: await this.getOriginalSource(),
        [this.columns[1].name]: await this.page.content()
      }
    ];
  }

  private async getOriginalSource(): Promise<string> {
    if (this.response) {
      return this.response.text();
    }
    return "page_didnt_respond";
  }
}