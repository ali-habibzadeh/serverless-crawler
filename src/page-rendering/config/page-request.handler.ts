import { Minimatch } from "minimatch";
import { Request } from "puppeteer-core";

import { adGlobs } from "./constants/ad-rejections";
import { analyticsGlobs } from "./constants/analytics-rejections";
import { blockedResourceTypes } from "./constants/blocked-resource-types";
import Axios from "axios";

export class PageRequestHandler {
  private url = this.request.url();
  constructor(private request: Request) {}

  public async handle(): Promise<void> {
    if (this.isBlocked()) {
      return this.request.abort();
    }
    try {
      const { data, headers, status } = await Axios.get(this.url, { timeout: 4000 });
      return this.request.respond({ headers, status, body: data });
    } catch (e) {
      return this.request.abort();
    }
  }

  private isBlocked(): boolean {
    const isBlockedType = blockedResourceTypes.includes(this.request.resourceType());
    const isAdOrAnalytics = [...adGlobs, ...analyticsGlobs].some(token => this.matches(token));
    return isBlockedType || isAdOrAnalytics;
  }

  private matches(glob: string): boolean {
    return new Minimatch(glob).match(this.url);
  }
}
