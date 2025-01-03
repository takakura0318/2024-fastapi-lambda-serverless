import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ConfigType } from "@/lib/configType";
import { BackendApi } from "./constructs/backendApi";

export interface LocalStackProps extends StackProps {
  config: ConfigType;
}

// LocalStack
export class LocalStack extends Stack {
  constructor(scope: Construct, id: string, props: LocalStackProps) {
    super(scope, id, props);
    const { config } = props
    new BackendApi(this, "LocalStackBackendApi", {
      env: config.env,
    });
  }
}
