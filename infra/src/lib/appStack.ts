import { StackProps, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ConfigType } from './configType';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { BackendApi } from './constructs/backendApi';
import { Network } from './constructs/network';

export interface AppStackProps extends StackProps {
  config: ConfigType;
  certificate: ICertificate;
}

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);
    const { config } = props;
    const network = new Network(this, "Network", { cidr: config.cidr })

    new BackendApi(this, "BackendApi", {
      env: config.env,
      vpc: network.vpc,
      domainName: config.domainName!,
      hostedZoneId: config.hostedZoneId!,
    });
  }
}
