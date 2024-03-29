import { CustomMetric } from "./custom-metric.model";
import { DynamoStore } from "@shiftcoders/dynamo-easy";

class CustomMetricsService {
  public store = new DynamoStore(CustomMetric);
  private static instance: CustomMetricsService;
  private metrics!: CustomMetric[];
  private isCacheWarmedUp = false;

  private constructor() {}

  public static getInstance(): CustomMetricsService {
    if (!CustomMetricsService.instance) {
      CustomMetricsService.instance = new CustomMetricsService();
    }
    return CustomMetricsService.instance;
  }

  public async warmUpCache(): Promise<void> {
    if (this.isCacheWarmedUp) return;
    const items = await this.store.scan().exec();
    this.metrics = items;
    this.isCacheWarmedUp = true;
  }

  public getCustomMetrics(): CustomMetric[] {
    if (this.isCacheWarmedUp) return this.metrics;
    throw new Error('First warm up the cache by calling "warmUpCache()"');
  }
}

export const customMetricsService = CustomMetricsService.getInstance();
