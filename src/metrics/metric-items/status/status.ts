import { Page, Response } from "puppeteer";

import { Schema } from "@aws-cdk/aws-glue";

import { BaseMetric } from "../../base-types/base-metric";

export class ResponseStatus extends BaseMetric {
  public columnName = "status";
  public schemaType = Schema.INTEGER;
  public isGlueColumn = true;

  constructor(protected page: Page, response: Response | null) {
    super(page, response);
  }

  public async getMetric(): Promise<Record<string, number>> {
    return {
      [this.columnName]: this.response!.status(),
    };
  }
}
