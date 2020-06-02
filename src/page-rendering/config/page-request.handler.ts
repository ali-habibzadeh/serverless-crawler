import { Minimatch } from "minimatch";
import { Request } from "puppeteer-core";

import { adRejections } from "./constants/ad-rejections";
import { analyticsRejections } from "./constants/analytics-rejections";
import { blockedResourceTypes } from "./constants/blocked-resource-types";
import Axios from "axios";

export class PageRequestHandler {
  constructor(private request: Request) {}

  public async handle(): Promise<void> {
    if (this.isBlocked()) {
      return this.request.abort();
    }
    try {
      const { data, headers, status } = await Axios.get(this.request.url(), { timeout: 2000 });
      return this.request.respond({ headers, status, body: data });
    } catch (e) {
      return this.request.abort();
    }
  }

  private isBlocked(): boolean {
    const resourceType = this.request.resourceType();
    const isBlockedType = blockedResourceTypes.includes(resourceType);
    const isAdvert = adRejections.some((token) => this.globMatchesUrl(token));
    const isAnalytics = analyticsRejections.some((token) => this.globMatchesUrl(token));
    return isBlockedType || isAdvert || isAnalytics;
  }

  private globMatchesUrl(glob: string): boolean {
    const url = this.request.url();
    return new Minimatch(glob).match(url);
  }
}
