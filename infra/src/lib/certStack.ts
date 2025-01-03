import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs/lib/construct';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import {
  Certificate,
  CertificateValidation,
  ICertificate,
} from 'aws-cdk-lib/aws-certificatemanager';

export interface CertStackProps extends StackProps {
  domainName: string;
  hostedZoneId: string;
}

export class CertStack extends Stack {
  public readonly certificate: ICertificate;
  constructor(scope: Construct, id: string, props: CertStackProps) {
    super(scope, id, props);

    const { domainName, hostedZoneId } = props;
    const hostedZone = HostedZone.fromHostedZoneAttributes(
      this,
      "PublicHostedZone",
      {
        zoneName: domainName,
        hostedZoneId,
      }
    );

    this.certificate = new Certificate(this, "Certificate", {
      domainName,
      validation: CertificateValidation.fromDns(hostedZone),
    });
  }
}
