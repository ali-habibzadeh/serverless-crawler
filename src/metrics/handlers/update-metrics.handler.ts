import { APIGatewayProxyEvent } from "aws-lambda";
import { Glue } from "aws-sdk";
import { appConfig } from "../../config/config.service";
import { ColumnList, Column } from "aws-sdk/clients/glue";
import { customMetricsService } from "../custom-metrics/custom-metrics.service";

interface ICustomMetricEntry {
  id: string;
  type: string;
  fn: string;
}

export class UpdateMetricsHandler {
  private glue = new Glue();
  private dbName = appConfig.deliveryStreamDbName;
  private tableName = appConfig.deliveryStreamMetricsTableName;
  constructor(private event: APIGatewayProxyEvent) {}

  public async handle(): Promise<any> {
    const { id, type, fn } = this.getColumnEntry();
    await this.updateGlueColumns({ Name: id, Type: type });
    await customMetricsService.store.put({ id, fn }).exec();
  }

  private async updateGlueColumns(newColumn: Column): Promise<any> {
    const columns = (await this.getExistingColumns()) || [];
    const index = columns.findIndex(c => c.Name === newColumn.Name);
    index === -1 ? columns.push(newColumn) : (columns[index] = newColumn);
    return this.glue
      .updateTable({
        DatabaseName: this.dbName,
        TableInput: { Name: this.tableName, StorageDescriptor: { Columns: columns } }
      })
      .promise();
  }

  private async getExistingColumns(): Promise<ColumnList | undefined> {
    const table = await this.glue.getTable({ DatabaseName: this.dbName, Name: this.tableName }).promise();
    return table.Table?.StorageDescriptor?.Columns;
  }

  private getColumnEntry(): ICustomMetricEntry {
    if (this.event.body) {
      return JSON.parse(this.event.body);
    }
    throw new Error(`Invalid body: ${this.event.body}`);
  }
}
