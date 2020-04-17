import { EventAction, FilterGroup, Project, Source } from "@aws-cdk/aws-codebuild";
import { Construct, Stack, StackProps } from "@aws-cdk/core";

const source = Source.gitHub({
  owner: "ali-habibzadeh",
  repo: "alexa",
  webhook: true,
  webhookFilters: [FilterGroup.inEventOf(EventAction.PUSH).andBranchIs("master")],
});

export class DeploymentStack extends Stack {
  constructor(parent: Construct, id: string, props?: StackProps) {
    super(parent, id, props);
  }

  public project = new Project(this, "my-deployment-stacl", {});
}
