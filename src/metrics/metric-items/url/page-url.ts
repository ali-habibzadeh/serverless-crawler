import { Page, Response } from "puppeteer";

import { Schema } from "@aws-cdk/aws-glue";

import { BaseMetric } from "../../base-types/base-metric";

export class PageUrl extends BaseMetric {
  public columnName = "url";
  public schemaType = Schema.STRING;
  public isGlueColumn = true;

  constructor(protected page: Page, response: Response | null) {
    super(page, response);
  }

  public async getMetric(): Promise<Record<string, any>> {
    return {
      [this.columnName]: this.page.url(),
    };
  }
}
