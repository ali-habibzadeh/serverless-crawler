import { filter } from "async";

export abstract class BaseQualifier {
  public async getQualifiedUrls(hrefs: string[]): Promise<string[]> {
    return filter(hrefs, async url => this.isQualified(url));
  }
  protected abstract async isQualified(url: string): Promise<boolean>;
}
