import { Construct, Duration } from "@aws-cdk/core";
import { Cluster, ContainerImage, FargatePlatformVersion, AwsLogDriver } from "@aws-cdk/aws-ecs";
import { Vpc } from "@aws-cdk/aws-ec2";
import { ApplicationLoadBalancedFargateService } from "@aws-cdk/aws-ecs-patterns";
import { ApplicationProtocol } from "@aws-cdk/aws-elasticloadbalancingv2";

export class RenderingCluster extends Construct {
  constructor(parent: Construct, id: string, private vpc: Vpc) {
    super(parent, id);
    this.applyAutoScalingRules();
    this.configureClusterHealth();
  }

  public port = 3000;
  public renderingCluster = new Cluster(this, "RenderingCluster", { vpc: this.vpc });

  public loadBalancedService = new ApplicationLoadBalancedFargateService(this, "LoadBalancedService", {
    cluster: this.renderingCluster,
    cpu: 4096,
    memoryLimitMiB: 8192,
    desiredCount: 1,
    maxHealthyPercent: 100,
    taskImageOptions: {
      image: ContainerImage.fromRegistry("browserless/chrome:latest"),
      containerPort: this.port,
      enableLogging: true,
      logDriver: new AwsLogDriver({ streamPrefix: "ChromeImageLogs" }),
      environment: {
        MAX_CONCURRENT_SESSIONS: "10"
      }
    },
    publicLoadBalancer: true,
    protocol: ApplicationProtocol.HTTP,
    listenerPort: this.port,
    assignPublicIp: true,
    platformVersion: FargatePlatformVersion.VERSION1_4
  });

  private applyAutoScalingRules(): void {
    const scalableTarget = this.loadBalancedService.service.autoScaleTaskCount({
      minCapacity: 6,
      maxCapacity: 10
    });
    scalableTarget.scaleOnCpuUtilization("CpuScaling", {
      targetUtilizationPercent: 80
    });
  }

  private configureClusterHealth(): void {
    this.loadBalancedService.targetGroup.setAttribute("deregistration_delay.timeout_seconds", "30");
    this.loadBalancedService.targetGroup.configureHealthCheck({
      interval: Duration.seconds(5),
      healthyHttpCodes: "200",
      healthyThresholdCount: 2,
      unhealthyThresholdCount: 3,
      timeout: Duration.seconds(4)
    });
  }
}
