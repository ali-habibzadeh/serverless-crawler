import { Page, Response } from "puppeteer-core";
import { BaseMetricContainer } from "../base-types/base-metric-container";
import { customMetricStore } from "./custom-metric.model";

export class CustomMetricsContainer extends BaseMetricContainer {
  constructor(protected page: Page, protected response: Response | null) {
    super(page, response);
  }
  public columns = [];

  public async getMetrics(): Promise<Record<string, any>[]> {
    const metrics = await customMetricStore.query().exec();
    return Promise.all(
      metrics.map(async metric => {
        const { id, fn } = metric;
        return { [id]: await this.page.evaluate(fn) };
      })
    );
  }
}
