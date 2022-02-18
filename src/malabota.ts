#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CoreStacks } from './core/core-stacks';
import { PROJECT } from './common/app-info';

const app = new cdk.App();
const appName = PROJECT;

const coreStacks = new CoreStacks(app, 'core', { appName, module: 'core' });
