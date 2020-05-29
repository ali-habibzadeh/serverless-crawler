import { connect, Browser } from "puppeteer-core";
import { appConfig } from "../../config/config.service";

export class BrowserService {
  private static browser?: Browser;
  private static endpoint = `http://${appConfig.chromeClusterDns}:${appConfig.chromeClusterPort}`;

  public static async createBrowser(): Promise<void> {
    if (this.browser) return;
    this.browser = await connect({ browserWSEndpoint: this.endpoint });
  }

  public static getBrowser(): Browser {
    return this.browser!;
  }

  public static async close(): Promise<void> {
    await this.browser!.close();
    this.browser = undefined;
  }
}
