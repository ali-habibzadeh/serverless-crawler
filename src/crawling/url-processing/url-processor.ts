import { DynamodbService } from "../../core/dynamodb/dynamodb.service";
import { PageRenderService } from "../../page-rendering/page-render.service";
import { CrawlUrl } from "./crawl-url.model";

export class UrlsProcessor {
  constructor(private crawlUrl: CrawlUrl) {}

  public async process(): Promise<void> {
    const renderer = new PageRenderService(this.crawlUrl.url);
    const metrics = await renderer.getPageRenderMetrics();
    const allLinks: string[] = metrics.find((metric) => metric.name === "internalLinks")?.value;
    // tslint:disable-next-line: ban
    const toSave: CrawlUrl[] = allLinks?.map((href) => Object.assign(new CrawlUrl(), { url: href }));
    const writer = DynamodbService.getInstance().batchPut(toSave);
    for await (const persisted of writer) {
      console.log(`Successfully wrote ${persisted.url}`);
    }
  }
}
