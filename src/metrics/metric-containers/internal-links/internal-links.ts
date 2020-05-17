import { Page, Response } from "puppeteer-core";

import { Schema } from "@aws-cdk/aws-glue";

import { BaseMetricContainer } from "../../base-types/base-metric-container";
import { MetricNames } from "../../metrics-list";
import { getNormalLinks } from "./link-utils";

export class InternalLinks extends BaseMetricContainer {
  constructor(protected page: Page, response: Response | null) {
    super(page, response);
  }

  public columns = [{ name: MetricNames.InternalLinks, type: Schema.STRING, isGlueColumn: false }];

  public async getMetrics(): Promise<Record<string, string[]>[]> {
    return [{ [this.columns[0].name]: await this.getAllInternalLinks() }];
  }

  private async getAllInternalLinks(): Promise<string[]> {
    const links = await this.page.evaluate(() =>
      [...document.querySelectorAll("a")].map((link) => ({
        attrHref: link.getAttribute("href"),
        href: link.href
      }))
    );
    return getNormalLinks(links).filter((href) => !this.isExternalLink(href));
  }

  private isExternalLink(href: string): boolean {
    const pageUrl = this.page.url();
    try {
      return new URL(href).hostname !== new URL(pageUrl).hostname;
    } catch (e) {
      return false;
    }
  }
}
