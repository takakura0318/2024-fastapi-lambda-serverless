import { ConfigType } from "@/lib/configType";

const env = 'stg';
export const stgConfig: ConfigType = {
  project: "2024-lambda-serverless-fastapi",
  env: env,
  domainName: `${env}.aws-lab.blog`,
  hostedZoneId: "Z0107134JM5OVTKWYCKL",
  cidr: "10.0.0.0/16",
};
