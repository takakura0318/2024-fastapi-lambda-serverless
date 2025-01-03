import {
  IpAddresses,
  IVpc,
  SubnetType,
  Vpc,
} from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export interface NetworkProps {
  cidr: string;
}

export class Network extends Construct {
  readonly vpc: IVpc;

  constructor(
    scope: Construct,
    id: string,
    props: NetworkProps,
  ) {
    super(scope, id);
    const { cidr } = props;

    const vpc = new Vpc(this, "Vpc", {
      ipAddresses: IpAddresses.cidr(cidr),
      // AZ数：1個
      maxAzs: 1,
      // NATGatewayを作成しない
      natGateways: 0,
      enableDnsSupport: true,
      enableDnsHostnames: true,
      subnetConfiguration: [
        {
          cidrMask: 24,
          // プライベート
          subnetType: SubnetType.PRIVATE_ISOLATED,
          name: "app",
        },
      ],
    });

    this.vpc = vpc;
  }
}
