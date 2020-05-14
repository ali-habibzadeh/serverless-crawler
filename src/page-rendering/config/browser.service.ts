import chromium from "chrome-aws-lambda";
import { Browser } from "puppeteer-core";

import { CatchAll } from "../../core/utils/catch-all";

export class BrowserService {
  private static browser?: Browser;

  @CatchAll
  public static async createBrowser(): Promise<void> {
    if (this.browser) {
      return;
    }
    this.browser = await chromium.puppeteer.launch({
      args: [...chromium.args, "--single-process"],
      defaultViewport: chromium.defaultViewport,
      headless: chromium.headless,
      executablePath: await chromium.executablePath,
    });
  }

  public static getBrowser(): Browser {
    return this.browser!;
  }

  public static async close(): Promise<void> {
    await this.browser!.close();
    this.browser = undefined;
  }
}
