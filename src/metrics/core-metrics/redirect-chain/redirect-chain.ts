import { Page, Response } from "puppeteer-core";

import { Schema } from "@aws-cdk/aws-glue";

import { BaseMetricContainer } from "../../base-types/base-metric-container";
import { MetricNames } from "../../metrics-list";
import { IRedirectChainItem } from "./redirect-chain.interface";

export class RedirectChain extends BaseMetricContainer {
  constructor(protected page: Page, response: Response | null) {
    super(page, response);
  }

  public columns = [
    {
      name: MetricNames.RedirectChain,
      type: Schema.array(
        Schema.struct([
          { name: "url", type: Schema.STRING },
          { name: "status", type: Schema.INTEGER },
          { name: "is_redirect", type: Schema.BOOLEAN }
        ])
      ),
      isGlueColumn: true
    }
  ];

  public async getMetrics(): Promise<Record<string, IRedirectChainItem[]>[]> {
    return [{ [this.columns[0].name]: this.getRedirectChain() }];
  }

  private getRedirectChain(): IRedirectChainItem[] {
    const redirects = this.response!.request().redirectChain();
    const chain = redirects.map(request => ({
      url: request.url(),
      status: request.response()!.status(),
      is_redirect: true
    }));
    return [...chain, { url: this.page.url(), status: this.response!.status(), is_redirect: false }];
  }
}
