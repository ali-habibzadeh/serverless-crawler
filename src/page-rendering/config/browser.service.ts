import { connect, Browser } from "puppeteer-core";
import { appConfig } from "../../config/config.service";

export class BrowserService {
  private static browser?: Browser;
  private static browserWSEndpoint = `http://${appConfig.chromeClusterDns}:3000`;

  public static async createBrowser(): Promise<void> {
    if (this.browser) return;
    try {
      this.browser = await connect({ browserWSEndpoint: this.browserWSEndpoint });
    } catch (e) {
      console.log(`browserWSEndpoint: ${this.browserWSEndpoint}`);
      console.log(e);
    }
  }

  public static getBrowser(): Browser {
    return this.browser!;
  }

  public static async close(): Promise<void> {
    await this.browser!.close();
    this.browser = undefined;
  }
}
