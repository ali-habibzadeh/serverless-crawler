import { connect, Browser } from "puppeteer-core";
import { appConfig } from "../../config/config.service";
import { getChromiumArgs } from "./constants/chromium-switches";

export class BrowserService {
  private static browser: Browser;

  public static async createBrowser(): Promise<void> {
    if (this.browser) return;
    const { chromeClusterDns: dns, chromeClusterPort: port } = appConfig;
    this.browser = await connect({ browserWSEndpoint: `ws://${dns}:${port}?${getChromiumArgs()}` });
  }

  public static async getBrowser(url: string): Promise<Browser> {
    await this.browser.defaultBrowserContext().overridePermissions(url, []);
    return this.browser;
  }

  public static async close(): Promise<void> {
    await this.browser.close();
  }
}
