import { APIGatewayProxyEvent } from "aws-lambda";
import { Glue } from "aws-sdk";
import { appConfig } from "../../config/config.service";
import { ColumnList, Column } from "aws-sdk/clients/glue";
import { customMetricsService } from "../custom-metrics/custom-metrics.service";
import { CustomMetric } from "../custom-metrics/custom-metric.model";

interface ICustomMetricEntry {
  id: string;
  type: string;
  fn: string;
}

export class CustomMetricsHandler {
  private glue = new Glue();
  private dbName = appConfig.deliveryStreamDbName;
  private tableName = appConfig.deliveryStreamMetricsTableName;

  constructor(private event: APIGatewayProxyEvent) {}

  public async handle(): Promise<CustomMetric[] | void> {
    switch (this.event.httpMethod) {
      case "POST":
        await this.addNewMetric();
      case "GET":
        return customMetricsService.store.scan().exec();
      default:
        throw new Error(`Invalid method: ${this.event.httpMethod}`);
    }
  }

  private async addNewMetric(): Promise<void> {
    const { id, type, fn } = this.getColumnEntry();
    await this.updateGlueColumns({ Name: id, Type: type });
    await customMetricsService.store.put({ id, fn, type }).exec();
  }

  private async updateGlueColumns(newColumn: Column): Promise<any> {
    const columns = (await this.getGlueColumns()) || [];
    const index = columns.findIndex(c => c.Name === newColumn.Name);
    index === -1 ? columns.push(newColumn) : (columns[index] = newColumn);
    const input = { Name: this.tableName, StorageDescriptor: { Columns: columns } };
    return this.glue.updateTable({ DatabaseName: this.dbName, TableInput: input }).promise();
  }

  private async getGlueColumns(): Promise<ColumnList | undefined> {
    const table = await this.glue.getTable({ DatabaseName: this.dbName, Name: this.tableName }).promise();
    return table.Table?.StorageDescriptor?.Columns;
  }

  private getColumnEntry(): ICustomMetricEntry {
    if (this.event.body) return JSON.parse(this.event.body);
    throw new Error(`Invalid body: ${this.event.body}`);
  }
}
