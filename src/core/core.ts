import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { AppInfo } from '../common/app-info';
import { InteractionHandlerStack } from './interaction-handler/interaction-handler-stack';

export interface CoreProps extends AppInfo {}

export class Core extends Construct {
  constructor(scope: Construct, id: string, props: CoreProps) {
    super(scope, id);

    const { appName, appEnv, module } = props;

    const interactionHandler = new InteractionHandlerStack(
      this,
      'interaction-handler',
      {
        ...props,
        stackName: `${appName}-${appEnv}-${module}-interaction-handler`,
      }
    );
  }
}
