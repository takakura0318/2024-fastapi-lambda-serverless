
import { IVpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import { CfnOutput, Duration } from "aws-cdk-lib";
import { Cors, DomainName, EndpointType, LambdaIntegration, RestApi, SecurityPolicy } from "aws-cdk-lib/aws-apigateway";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { Certificate, CertificateValidation } from "aws-cdk-lib/aws-certificatemanager";
import { ApiGatewayDomain } from "aws-cdk-lib/aws-route53-targets";

export interface BackendApiProps {
  env: string;
  vpc?: IVpc;
  domainName?: string;
  hostedZoneId?: string;
}

export class BackendApi extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: BackendApiProps
  ) {
    super(scope, id);
    const { env, vpc, domainName, hostedZoneId } = props;
    const isLocal: boolean = this.isLocalEnv(env);

    const handler: PythonFunction = new PythonFunction(this, "BackendApiHandler", {
      functionName: "backend-api-handler",
      architecture: Architecture.ARM_64,
      runtime: Runtime.PYTHON_3_12,
      handler: "handler",
      entry: "../backend/app",
      index: "main.py",
      memorySize: 512,
      timeout: Duration.minutes(5),
      environment: {
        ENV_NAME: env,
      },
      vpc: isLocal ? undefined : vpc,
      vpcSubnets: isLocal ? undefined : vpc!.selectSubnets({ subnetGroupName: "app" }),
    });

    const api: RestApi = new RestApi(this, "ApiGateway", {
      restApiName: "BackendProxyApiGateway",
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: Cors.DEFAULT_HEADERS,
        statusCode: 200,
      },
    })

    if (!isLocal) {
      const apiDomainName: string = `api.${domainName}`;
      const hostedZone = HostedZone.fromHostedZoneAttributes(this, "PublicHostedZone", {
        zoneName: domainName!,
        hostedZoneId: hostedZoneId!,
      });

      const certificate: Certificate = new Certificate(this, "ApiCertificate", {
        domainName: apiDomainName,
        validation: CertificateValidation.fromDns(hostedZone),
      });

      const customDomain: DomainName = api.addDomainName("CustomApiDomain", {
        domainName: apiDomainName,
        certificate: certificate!,
        endpointType: EndpointType.REGIONAL,
        securityPolicy: SecurityPolicy.TLS_1_2,
      });

      new ARecord(this, "ApiARecord", {
        zone: hostedZone,
        target: RecordTarget.fromAlias(new ApiGatewayDomain(customDomain)),
        recordName: apiDomainName,
      });

      new CfnOutput(this, "ApiDomainName", {
        value: apiDomainName,
        exportName: "ApiDomainName",
      });
    }

    const integration: LambdaIntegration = new LambdaIntegration(handler);
    api.root.addProxy({ defaultIntegration: integration, anyMethod: true });

    new CfnOutput(this, "ApiGatewayID", { value: api.restApiId });
  }

  private isLocalEnv(env: string): boolean {
    return env === "local";
  }

}