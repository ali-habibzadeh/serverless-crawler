import { Page, Response } from "puppeteer";

import { Schema } from "@aws-cdk/aws-glue";

import { BaseMetric } from "../../base-types/base-metric";
import { getNormalLinks } from "./link-utils";

export class InternalLinks extends BaseMetric {
  public columnName = "internal_links";
  public schemaType = Schema.STRING;
  public isGlueColumn = false;

  constructor(protected page: Page, response: Response | null) {
    super(page, response);
  }

  public async getMetric(): Promise<Record<string, string[]>> {
    return {
      [this.columnName]: await this.getAllInternalLinks(),
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
