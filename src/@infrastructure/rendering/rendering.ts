import { Construct } from "@aws-cdk/core";
import { Cluster, ContainerImage } from "@aws-cdk/aws-ecs";
import { Vpc } from "@aws-cdk/aws-ec2";
import { ApplicationLoadBalancedFargateService } from "@aws-cdk/aws-ecs-patterns";
import { ApplicationProtocol } from "@aws-cdk/aws-elasticloadbalancingv2";

export class RenderingCluster extends Construct {
  constructor(parent: Construct, id: string, private vpc: Vpc) {
    super(parent, id);
    this.applyAutoScalingRules();
  }

  public renderingCluster = new Cluster(this, "RenderingCluster", { vpc: this.vpc });

  public loadBalancedService = new ApplicationLoadBalancedFargateService(this, "LoadBalancedService", {
    cluster: this.renderingCluster,
    cpu: 4096,
    desiredCount: 6,
    maxHealthyPercent: 100,
    taskImageOptions: {
      image: ContainerImage.fromRegistry("browserless/chrome:latest"),
      containerPort: 3000,
      enableLogging: true,
      environment: {
        MAX_CONCURRENT_SESSIONS: "10"
      }
    },
    memoryLimitMiB: 8192,
    publicLoadBalancer: true,
    protocol: ApplicationProtocol.HTTP,
    listenerPort: 3000,
    assignPublicIp: true
  });

  private applyAutoScalingRules(): void {
    const scalableTarget = this.loadBalancedService.service.autoScaleTaskCount({
      minCapacity: 6,
      maxCapacity: 200
    });
    scalableTarget.scaleOnCpuUtilization("CpuScaling", {
      targetUtilizationPercent: 80
    });
  }
}
