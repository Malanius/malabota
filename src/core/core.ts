import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { AppInfo } from '../common/app-info';
import { SecretsStack } from './secrets/secrets-stack';
import { InteractionHandlerStack } from './interaction-handler/interaction-handler-stack';

export interface CoreProps extends AppInfo {}

export class Core extends Construct {
  constructor(scope: Construct, id: string, props: CoreProps) {
    super(scope, id);

    const { appName, appEnv, module } = props;

    const secrets = new SecretsStack(this, 'secrets', {
      ...props,
      stackName: `${appName}-${appEnv}-${module}-secrets`,
    });

    const interactionHandler = new InteractionHandlerStack(
      this,
      'interaction-handler',
      {
        ...props,
        discordAppSecret: secrets.discordApp,
        stackName: `${appName}-${appEnv}-${module}-interaction-handler`,
      }
    );
  }
}
