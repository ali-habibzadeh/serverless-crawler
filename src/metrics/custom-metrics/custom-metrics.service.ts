import { CustomMetric } from "./custom-metric.model";
import { DynamoStore } from "@shiftcoders/dynamo-easy";

class CustomMetricsService {
  private static instance: CustomMetricsService;
  private store = new DynamoStore(CustomMetric);
  private metrics!: CustomMetric[];
  private isWarmedUp = false;

  private constructor() {}

  public static getInstance(): CustomMetricsService {
    if (!CustomMetricsService.instance) {
      CustomMetricsService.instance = new CustomMetricsService();
    }
    return CustomMetricsService.instance;
  }

  public async warmUpCache(): Promise<void> {
    const items = await this.store.scan().exec();
    console.log("WARMEDUP");
    this.metrics = items;
    this.isWarmedUp = true;
  }

  public getCustomMetrics(): CustomMetric[] {
    if (this.isWarmedUp) {
      return this.metrics;
    }
    throw new Error('First warm up the cache by calling "warmUpCache()"');
  }
}

export const customMetricsService = CustomMetricsService.getInstance();
