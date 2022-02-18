import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { ENVIRONMENTS } from '../common/app-info';
import { tagKeys } from '../common/tags';
import { Core } from './core';

export interface CoreStacksProps {
  appName: string;
  module: string;
}

export class CoreStacks extends Construct {
  constructor(scope: Construct, id: string, props: CoreStacksProps) {
    super(scope, id);

    const { appName, module } = props;

    ENVIRONMENTS.forEach((appEnv) => {
      const core = new Core(this, appEnv, {
        appName,
        appEnv,
        module,
      });

      cdk.Aspects.of(core).add(new cdk.Tag(tagKeys.project, appName));
      cdk.Aspects.of(core).add(new cdk.Tag(tagKeys.env, appEnv));
      cdk.Aspects.of(core).add(new cdk.Tag(tagKeys.component, module));
    });
  }
}
