import { Page, Response } from "puppeteer-core";

import { Schema } from "@aws-cdk/aws-glue";
import { CDPSessionClient } from "../../../page-rendering/cdp/cdp-session-client";

import { BaseMetricContainer } from "../../base-types/base-metric-container";
import { MetricNames } from "../../metrics-list";
import { getNormalLinks } from "./link-utils";

export class InternalLinks extends BaseMetricContainer {
  constructor(protected page: Page, protected response: Response | null, protected cdp: CDPSessionClient) {
    super(page, response, cdp);
  }

  public columns = [{ name: MetricNames.InternalLinks, type: Schema.STRING, isGlueColumn: false }];

  public async getMetrics(): Promise<Record<string, string[]>[]> {
    return [{ [this.columns[0].name]: await this.getAllInternalLinks() }];
  }

  private async getAllInternalLinks(): Promise<string[]> {
    const links = await this.page.evaluate(() =>
      [...document.querySelectorAll("a")].map(link => ({
        attrHref: link.getAttribute("href"),
        href: link.href
      }))
    );
    return getNormalLinks(links).filter(href => !this.isExternalLink(href));
  }

  private isExternalLink(href: string): boolean {
    const pageUrl = this.page.url();
    const originalHost = new URL(pageUrl).hostname;
    const thisHrefHost = new URL(href).hostname;
    return thisHrefHost !== originalHost && !thisHrefHost.endsWith(`.${originalHost}`);
  }
}
