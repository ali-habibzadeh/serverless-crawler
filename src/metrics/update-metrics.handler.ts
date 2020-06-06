import { APIGatewayProxyEvent } from "aws-lambda";
import { Glue } from "aws-sdk";
import { appConfig } from "../config/config.service";

// tslint:disable:no-commented-code
// tslint:disable:no-commented-out-code

export class UpdateMetricsHandler {
  private glue = new Glue();
  constructor(private event: APIGatewayProxyEvent) {}

  public async handle(): Promise<any> {
    const { deliveryStreamDbName, deliveryStreamMetricsTableName, deliveryStreamCatalogId } = appConfig;
    return this.glue
      .getTable({
        DatabaseName: deliveryStreamDbName,
        Name: deliveryStreamMetricsTableName,
        CatalogId: deliveryStreamCatalogId
      })
      .promise();
  }
}

// return this.glue
//   .updateTable({
//     DatabaseName: appConfig.deliveryStreamDbName,
//     TableInput: {
//       Name: appConfig.deliveryStreamMetricsTableName,
//       StorageDescriptor: {
//           Columns: []
//       }
//     },
//     CatalogId: appConfig.deliveryStreamCatalogId
//   })
//   .promise();
