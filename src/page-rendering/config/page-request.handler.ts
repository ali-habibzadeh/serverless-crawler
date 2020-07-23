import { Request } from "puppeteer-core";

import { blockedResourceTypes } from "./constants/blocked-resource-types";
import Axios from "axios";

export class PageRequestHandler {
  constructor(private request: Request) {}

  public async handle(): Promise<void> {
    if (this.isBlocked()) return this.request.abort();
    try {
      const { data, headers, status } = await Axios.request({
        url: this.request.url(),
        method: this.request.method(),
        headers: this.request.headers()
      });
      return this.request.respond({ headers, status, body: data });
    } catch (e) {
      return this.request.abort();
    }
  }

  private isBlocked(): boolean {
    return blockedResourceTypes.includes(this.request.resourceType());
  }
}
