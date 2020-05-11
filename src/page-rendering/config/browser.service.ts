import chromium from "chrome-aws-lambda";
import { Browser } from "puppeteer-core";

export class BrowserService {
  private static browser: Browser;

  public static async createBrowser(): Promise<void> {
    if (this.browser) {
      return;
    }
    this.browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      headless: chromium.headless,
      executablePath: await chromium.executablePath,
    });
  }

  public static getBrowser(): Browser {
    return this.browser;
  }

  public static async close(): Promise<void> {
    return this.browser.close();
  }
}
