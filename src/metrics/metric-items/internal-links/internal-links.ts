import { Page, Response } from "puppeteer";

import { BaseMetric } from "../../base-types/base-metric";
import { IMetricValue } from "../../base-types/metric.interface";
import { getNormalLinks } from "./link-utils";

export class InternalLinks extends BaseMetric {
  constructor(protected page: Page, response: Response | null) {
    super(page, response);
  }

  public async getMetricValue(): Promise<IMetricValue<string[]>> {
    return {
      value: await this.getAllInternalLinks(),
      name: InternalLinks.name,
    };
  }

  private async getAllInternalLinks(): Promise<string[]> {
    const links = await this.page.evaluate(() =>
      [...document.querySelectorAll("a")].map((link) => ({
        attrHref: link.getAttribute("href"),
        href: link.href,
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
