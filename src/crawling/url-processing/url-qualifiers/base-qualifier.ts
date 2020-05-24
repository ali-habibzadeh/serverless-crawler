export abstract class BaseQualifier {
  constructor(protected hrefs: string[]) {}
  public async getQualifiedUrls(): Promise<string[]> {
    return this.hrefs.filter(async (url) => this.isQualified(url));
  }
  protected abstract async isQualified(url: string): Promise<boolean>;
}
