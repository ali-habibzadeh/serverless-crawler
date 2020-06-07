import { APIGatewayProxyEvent } from "aws-lambda";
import { Glue } from "aws-sdk";
import { appConfig } from "../../config/config.service";
import { ColumnList } from "aws-sdk/clients/glue";
import { customMetricStore, customMetricsCache } from "../custom-metrics/custom-metric.model";

interface ICustomMetricEntry {
  id: string;
  type: string;
  fn: string;
}

export class UpdateMetricsHandler {
  private glue = new Glue();
  private dbName = appConfig.deliveryStreamDbName;
  private tableName = appConfig.deliveryStreamMetricsTableName;
  constructor(private event: any) {}

  public async handle(): Promise<any> {
    const entries = this.getColumnEntries();
    await this.updateGlueColumns(entries.map(entry => ({ Name: entry.id, Type: entry.type })));
    await customMetricStore
      .batchWrite()
      .put(
        entries.map(entry => {
          const { id, fn } = entry;
          return { id, fn };
        })
      )
      .exec();
    customMetricsCache.setKey("custom-metrics", await customMetricStore.scan().exec());
  }

  private async updateGlueColumns(additionalCols: ColumnList): Promise<any> {
    const existingColumns = (await this.getExistingColumns()) || [];
    return this.glue
      .updateTable({
        DatabaseName: this.dbName,
        TableInput: {
          Name: this.tableName,
          StorageDescriptor: {
            Columns: [...existingColumns, ...additionalCols]
          }
        }
      })
      .promise();
  }

  private async getExistingColumns(): Promise<ColumnList | undefined> {
    const table = await this.glue
      .getTable({
        DatabaseName: this.dbName,
        Name: this.tableName
      })
      .promise();
    return table.Table?.StorageDescriptor?.Columns;
  }

  private getColumnEntries(): ICustomMetricEntry[] {
    console.log(this.event);
    if (this.event.body) {
      const { columns } = this.event.body;
      return columns;
    }
    throw new Error(`Invalid body: ${this.event.body}`);
  }
}
