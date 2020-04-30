import { PageRenderService } from "../../page-rendering/page-render.service";
import { CrawlUrl } from "./crawl-url.model";

export class UrlsProcessor {
  private readonly bufferSize = 30;

  constructor(private crawlUrl: CrawlUrl) {}

  public async process(): Promise<void> {
    const renderer = new PageRenderService(this.crawlUrl.url);
    const metrics = await renderer.getPageRenderMetrics();
    console.log(metrics);
  }

  private async getAllLinks(): Promise<string[]> {
    return ["...", "..."];
  }
}
