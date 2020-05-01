import { Page, Response } from "puppeteer";
import { URL } from "url";

import { BaseMetric } from "../../base-types/base-metric";
import { IMetricValue } from "../../base-types/metric.interface";

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
    const links = await this.page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("a"));
      const normalLinks = links.filter((link) => {
        const href = link.getAttribute("href");
        return !href?.startsWith("#") && !href?.startsWith("data:") && href;
      });
      return normalLinks.map((link) => link.href);
    });
    return [...new Set(links)].filter((href) => !this.isExternalLink(href));
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
