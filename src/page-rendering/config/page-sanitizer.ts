import { Page } from "puppeteer-core";

export class PageSanitizer {
  constructor(private page: Page) {}

  private async replaceServiceWorkerRegister(): Promise<void> {
    await this.page.addScriptTag({
      content: `
      const fn = () => {};
      navigator.serviceWorker.register = () => new Promise(fn, fn);`
    });
  }
}
