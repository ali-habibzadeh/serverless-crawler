import { Minimatch } from "minimatch";
import { Request } from "puppeteer-core";

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
      const { data, headers, status } = await Axios.get(this.url, { timeout: 10000 });
      return this.request.respond({ headers, status, body: data });
    } catch (e) {
      return this.request.abort();
    }
  }

  private isBlocked(): boolean {
    return blockedResourceTypes.includes(this.request.resourceType());
  }

  private matches(glob: string): boolean {
    return new Minimatch(glob).match(this.url);
  }
}
