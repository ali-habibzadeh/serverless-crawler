import { Construct } from "@aws-cdk/core";
import { Cluster, ContainerImage } from "@aws-cdk/aws-ecs";
import { Vpc } from "@aws-cdk/aws-ec2";
import { ApplicationLoadBalancedFargateService } from "@aws-cdk/aws-ecs-patterns";
import { ApplicationProtocol } from "@aws-cdk/aws-elasticloadbalancingv2";

export class RenderingCluster extends Construct {
  constructor(parent: Construct, id: string, private vpc: Vpc) {
    super(parent, id);
  }

  public renderingCluster = new Cluster(this, "RenderingCluster", { vpc: this.vpc });

  public loadBalancedService = new ApplicationLoadBalancedFargateService(this, "LoadBalancedService", {
    cluster: this.renderingCluster,
    cpu: 512,
    desiredCount: 6,
    taskImageOptions: {
      image: ContainerImage.fromRegistry("browserless/chrome:latest"),
      containerPort: 3000,
      enableLogging: true
    },
    memoryLimitMiB: 2048,
    publicLoadBalancer: true,
    protocol: ApplicationProtocol.HTTP,
    listenerPort: 3000,
    assignPublicIp: true
  });
}
