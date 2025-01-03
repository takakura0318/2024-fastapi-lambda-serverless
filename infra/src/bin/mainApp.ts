
import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { localConfig } from '@/env/local';
import { stgConfig } from '@/env/stg';
import { ConfigType } from '@/lib/configType';
import { LocalStack } from '@/lib/localStack';
import { CertStack } from '@/lib/certStack';
import { AppStack } from '@/lib/appStack';

const account: string = process.env["CDK_DEPLOY_ACCOUNT"] || process.env["CDK_DEFAULT_ACCOUNT"] || "000000000000";
const app = new App();

let config: ConfigType
if (account === "000000000000") {
  config = localConfig;
} else if (account === "533267014066") {
  config = stgConfig
} else {
  throw new Error("Invalid Account")
}

if (config !== localConfig) {
  const certStack: CertStack = new CertStack(app, "CertStack", {
    env: {
      account,
      region: "us-east-1",
    },
    domainName: config.domainName!,
    hostedZoneId: config.hostedZoneId!,
    crossRegionReferences: true,
  });
  new AppStack(app, 'appStack', {
    env: {
      account,
      region: "us-east-2",
    },
    config,
    certificate: certStack.certificate,
    crossRegionReferences: true,
  });

} else {
  // LocalStack
  new LocalStack(app, "LocalStack", {
    env: {
      account,
      region: "us-east-2"
    },
    config,
  });
}





