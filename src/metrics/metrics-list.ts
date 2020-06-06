import { Column } from "@aws-cdk/aws-glue";

import { InternalLinks } from "./core-metrics/internal-links/internal-links";
import { WebPerformance } from "./core-metrics/performance/performance";
import { ResponseStatus } from "./core-metrics/status/status";
import { PageUrl } from "./core-metrics/url/page-url";
import { PageHtml } from "./core-metrics/html/page-html";
import { Indexation } from "./core-metrics/indexation/indexation";
import { Responsive } from "./core-metrics/responsive/responsive";
import { Robots } from "./core-metrics/robots/robots";
import { RedirectChain } from "./core-metrics/redirect-chain/redirect-chain";
import { Popups } from "./core-metrics/popups/popups";
import { CustomMetricsContainer } from "./custom-metrics/custom-metric.container";

export enum MetricNames {
  Url = "url",
  Status = "status",
  InternalLinks = "internal_links",
  FirstContentfulPaint = "first_contentful_paint",
  LargestContentfulPaint = "largest_contetnful_paint",
  PageResourcesCount = "page_resources_count",
  PreRenderDom = "pre_render_dom",
  PostRenderDom = "post_redner_dom",
  NoIndex = "no_index",
  IsResponsive = "is_responsive",
  IsAllowedByRobots = "is_allowed_by_robots",
  RedirectChain = "redirect_chain",
  HasPopup = "has_popup"
}

export const metricsContainers = [
  PageUrl,
  InternalLinks,
  ResponseStatus,
  WebPerformance,
  PageHtml,
  Indexation,
  Responsive,
  Robots,
  Popups,
  RedirectChain,
  CustomMetricsContainer
];

export function getGlueColumns(): Column[] {
  return metricsContainers
    .map(metric => Reflect.construct(metric, []).columns)
    .flat()
    .filter(col => col.isGlueColumn)
    .map(col => ({ name: col.name, type: col.type }));
}
