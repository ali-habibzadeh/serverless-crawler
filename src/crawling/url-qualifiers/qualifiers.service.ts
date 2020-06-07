import { RobotsQualifier } from "./robots/robots-qualifier";
import { compose } from "async";

export class UrlsQualifierService {
  constructor(private hrefs: string[]) {}
  private qualifiers = [RobotsQualifier];

  public async getQualifiedUrls(): Promise<string[]> {
    const fns = this.qualifiers.map(qualifier => {
      const q = new qualifier();
      return q.getQualifiedUrls.bind(q);
    });
    return compose(...fns)(this.hrefs);
  }
}
