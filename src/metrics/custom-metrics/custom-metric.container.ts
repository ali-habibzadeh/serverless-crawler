import { Page, Response } from "puppeteer-core";
import { BaseMetricContainer } from "../base-types/base-metric-container";
import { customMetricStore } from "./custom-metric.model";

export class CustomMetricsContainer extends BaseMetricContainer {
  constructor(protected page: Page, protected response: Response | null) {
    super(page, response);
  }
  public columns = [];

  public async getMetrics(): Promise<Record<string, any>[]> {
    const items = await customMetricStore.scan().exec();
    return Promise.all(
      items.map(async metric => {
        const { id, fn } = metric;
        console.log(id, fn);
        return { [id]: await this.page.evaluate(fn) };
      })
    );
  }
}
