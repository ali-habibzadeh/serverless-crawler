import { SitemaplUrl, sitemapUrlStore } from "./models/sitemap-url.model";
import axios from "axios";
import { parseStringPromise } from "xml2js";
import { UrlsQualifierService } from "./url-qualifiers/url-qualifier.service";
import { plainToClass } from "class-transformer";
import { crawlUrlStore, CrawlUrl } from "./models/crawl-url.model";
import { chunk } from "lodash";

export class SitemapService {
  private sitemapStore = sitemapUrlStore;
  private urlStore = crawlUrlStore;
  constructor(private sitemapUrl: SitemaplUrl) {}

  public async crawl(): Promise<void> {
    const parsed = await this.getSitemapData();
    if (!parsed) return;
    const { sitemapindex, urlset } = parsed;

    if (sitemapindex) {
      const nodes: any[] = sitemapindex.sitemap;
      await this.crawlNextBatch(nodes.map(node => node.loc).flat());
    }
    if (urlset) {
      const nodes: any[] = urlset.url;
      await this.addToMainCrawl(nodes.map(node => node.loc).flat());
    }
  }

  public async getSitemapData(): Promise<any | undefined> {
    try {
      const { data } = await axios.get(this.sitemapUrl.url);
      return parseStringPromise(data);
    } catch (e) {
      undefined;
    }
  }

  private async crawlNextBatch(sitemapUrls: string[]): Promise<void> {
    const urls = sitemapUrls.map(url => plainToClass(SitemaplUrl, { url }));
    await this.sitemapStore.batchWrite().put(urls).exec();
  }

  private async addToMainCrawl(sitemapUrls: string[]): Promise<void> {
    const qualifieds = await new UrlsQualifierService(sitemapUrls).getQualifiedUrls();
    const urls = qualifieds.map(url => plainToClass(CrawlUrl, { url }));
    const chunks = chunk(urls, 25);
    await Promise.all(chunks.map(async chunk => this.urlStore.batchWrite().put(chunk).exec()));
  }
}
