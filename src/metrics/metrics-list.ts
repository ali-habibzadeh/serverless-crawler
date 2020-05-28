import { Column } from "@aws-cdk/aws-glue";

import { InternalLinks } from "./metric-containers/internal-links/internal-links";
import { WebPerformance } from "./metric-containers/performance/performance";
import { ResponseStatus } from "./metric-containers/status/status";
import { PageUrl } from "./metric-containers/url/page-url";
import { PageHtml } from "./metric-containers/html/page-html";

export enum MetricNames {
  Url = "url",
  Status = "status",
  InternalLinks = "internal_links",
  FCP = "first_contentful_paint",
  PageResourcesCount = "page_resources_count",
  PreRenderDom = "pre_render_dom",
  PostRenderDom = "post_redner_dom"
}

export const metricsContainers = [PageUrl, InternalLinks, ResponseStatus, WebPerformance, PageHtml];

export function getGlueColumns(): Column[] {
  return metricsContainers
    .map((metric) => Reflect.construct(metric, []).columns)
    .flat()
    .filter((col) => col.isGlueColumn)
    .map((col) => ({ name: col.name, type: col.type }));
}
