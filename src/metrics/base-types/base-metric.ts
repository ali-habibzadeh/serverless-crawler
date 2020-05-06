import { Page, Response } from "puppeteer-core";

import { Type } from "@aws-cdk/aws-glue";

export abstract class BaseMetric {
  public abstract columnName: string;
  public abstract schemaType: Type;
  public abstract isGlueColumn: boolean;

  constructor(protected page: Page, protected response: Response | null) {}

  public abstract getMetric(): Promise<any>;
}
