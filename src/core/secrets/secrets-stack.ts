import * as cdk from 'aws-cdk-lib';
import * as sm from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { AppInfo } from '../../common/app-info';

export const secretsFields = {
  discordApp: {
    applicationId: 'applicationId',
    publicKey: 'publicKey',
  },
};

export interface SecretsStackProps extends cdk.StackProps, AppInfo {}

export class SecretsStack extends cdk.Stack {
  public readonly discordApp: sm.ISecret;
  constructor(scope: Construct, id: string, props: SecretsStackProps) {
    super(scope, id, props);

    const { appName, appEnv, module } = props;

    this.discordApp = new sm.Secret(this, 'DiscordApp', {
      secretName: `/${appName}/${appEnv}/${module}/discord-app`,
    });
  }
}
