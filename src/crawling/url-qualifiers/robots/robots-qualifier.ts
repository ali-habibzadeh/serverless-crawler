import { BaseQualifier } from "../base-types/base-qualifier";
import { RobotsChecker } from "../../../metrics/core-metrics/robots/robots-checker";

export class RobotsQualifier extends BaseQualifier {
  constructor() {
    super();
  }

  private checker = (href: string) => RobotsChecker.getInstance().isAllowed(href);

  protected async isQualified(href: string): Promise<boolean> {
    return this.checker(href);
  }
}
