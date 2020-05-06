import { Column } from "@aws-cdk/aws-glue";

import { BaseMetric } from "./base-types/base-metric";
import { InternalLinks } from "./metric-items/internal-links/internal-links";
import { ResponseStatus } from "./metric-items/status/status";
import { PageUrl } from "./metric-items/url/page-url";

const list = [PageUrl, InternalLinks, ResponseStatus];

export class CrawlMetrics {
  public metricsList = list;

  public getGlueColumns(): Column[] {
    return this.getGlueMetrics().map((metric) => {
      const { columnName: name, schemaType: type } = metric;
      return {
        name,
        type,
      };
    });
  }

  private getGlueMetrics(): BaseMetric[] {
    return this.metricsList
      .map((metric) => Reflect.construct(metric, []))
      .filter((metric: BaseMetric) => metric.isGlueColumn);
  }
}
