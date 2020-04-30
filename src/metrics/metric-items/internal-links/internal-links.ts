import { Page, Response } from "puppeteer-core";
import { URL } from "url";

import { CDPSessionClient } from "../../../page-rendering/cdp/cdp-session-client";
import { BaseMetric } from "../../base-types/base-metric";
import { IMetricValue } from "../../base-types/metric.interface";

export class InternalLinks extends BaseMetric {
  private cdpSession = new CDPSessionClient(this.page);

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
    const allHrefs = await this.getAllLinksHrefs();
    return allHrefs.filter((href) => !this.isExternalLink(href));
  }

  private async getAllLinksHrefs(): Promise<string[]> {
    const nodeIds = await this.cdpSession.querySelectorAll("a");
    const hrefs = await Promise.all(nodeIds.map(async (nodeId) => this.getLinkHref(nodeId)));
    return hrefs.filter((href): href is string => href !== null);
  }

  private async getLinkHref(nodeId: number): Promise<string | null> {
    return this.cdpSession.getAttribute(nodeId, "href");
  }

  private isExternalLink(href: string | null): boolean {
    const pageUrl = this.page.url();
    try {
      return new URL(href || "").hostname !== new URL(pageUrl).hostname;
    } catch (e) {
      return false;
    }
  }
}
