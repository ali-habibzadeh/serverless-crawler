import { CrawlUrl } from "./crawl-url.model";

export class UrlProcessor {
  private readonly bufferSize = 30;

  constructor(private crawlUrl: CrawlUrl) {}

  public async process(): Promise<void> {
    await this.getAllLinks();
  }

  private async getAllLinks(): Promise<string[]> {
    return ["...", "..."];
  }
}
