export class UrlProcessor {
  private readonly bufferSize = 30;

  constructor(private url: string) {}

  public async process(): Promise<void> {
    await this.getAllLinks();
  }

  private async getAllLinks(): Promise<string[]> {
    return ["...", "..."];
  }
}
