import { Construct } from "@aws-cdk/core";
import { AttributeType, StreamViewType, BillingMode, Table } from "@aws-cdk/aws-dynamodb";
import { IGrantable } from "@aws-cdk/aws-iam";
import { CfnCluster } from "@aws-cdk/aws-dax";

export class CustomMetricsTable extends Construct {
  constructor(parent: Construct) {
    super(parent, "CustumMetricsConstruct");
  }

  public table = new Table(this, "CustomMetricsTable", {
    partitionKey: { name: "id", type: AttributeType.STRING },
    replicationRegions: ["us-east-2"],
    stream: StreamViewType.NEW_AND_OLD_IMAGES,
    timeToLiveAttribute: "ttl",
    billingMode: BillingMode.PAY_PER_REQUEST
  });

  public cluster = new CfnCluster(this, "CustomMetricsTableMemCache", {
    iamRoleArn: "",
    nodeType: "",
    replicationFactor: 1
  });

  public grantAll(grantee: IGrantable): void {
    this.table.grantReadWriteData(grantee);
  }
}
