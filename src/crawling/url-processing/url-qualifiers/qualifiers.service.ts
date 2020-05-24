import { RobotsQualifier } from "./robots/robots-qualifier";

export class UrlsQualifierService {
  constructor(private hrefs: string[]) {}
  private qualifiers = [RobotsQualifier];

  public async getQualifiedUrls(): Promise<string[]> {
    const qualifiedUrls = await Promise.all(
      this.qualifiers.map(async (qualifier) => new qualifier(this.hrefs).getQualifiedUrls())
    );
    return qualifiedUrls.flat();
  }
}
