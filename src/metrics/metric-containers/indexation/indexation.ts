import { Page, Response } from "puppeteer-core";

import { Schema } from "@aws-cdk/aws-glue";

import { BaseMetricContainer } from "../../base-types/base-metric-container";
import { MetricNames } from "../../metrics-list";

export class Indexation extends BaseMetricContainer {
  constructor(protected page: Page, response: Response | null) {
    super(page, response);
  }

  public columns = [{ name: MetricNames.NoIndex, type: Schema.BOOLEAN, isGlueColumn: true }];

  public async getMetrics(): Promise<Record<string, any>[]> {
    return [{ [this.columns[0].name]: (await this.hasMetaNoIndex()) || this.hasNoIndexHeahder() }];
  }

  private async hasMetaNoIndex(): Promise<boolean> {
    const assertion = () => document.querySelector(`meta[content="noindex"]`) !== null;
    return this.page.evaluate(assertion);
  }

  private hasNoIndexHeahder(): boolean {
    return this.response!.headers()["X-Robots-Tag"] === "noindex";
  }
}
