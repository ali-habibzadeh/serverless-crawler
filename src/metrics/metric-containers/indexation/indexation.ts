import { Page, Response } from "puppeteer-core";

import { Schema } from "@aws-cdk/aws-glue";

import { BaseMetricContainer } from "../../base-types/base-metric-container";
import { MetricNames } from "../../metrics-list";

export class Indexation extends BaseMetricContainer {
  private noindexAssertion = () => document.querySelector(`meta[content="noindex"]`) !== null;

  constructor(protected page: Page, response: Response | null) {
    super(page, response);
  }

  public columns = [{ name: MetricNames.NoIndex, type: Schema.BOOLEAN, isGlueColumn: true }];

  public async getMetrics(): Promise<Record<string, any>[]> {
    return [{ [this.columns[0].name]: (await this.hasMetaNoIndex()) || this.hasNoIndexHeahder() }];
  }

  private async hasMetaNoIndex(): Promise<boolean> {
    return this.page.evaluate(this.noindexAssertion);
  }

  private hasNoIndexHeahder(): boolean {
    return this.response!.headers()["X-Robots-Tag"] === "noindex";
  }
}
