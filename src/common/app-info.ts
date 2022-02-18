export const PROJECT = 'malabota';

export enum AppEnv {
  DEV = 'dev',
  PROD = 'prod',
}

export interface AppInfo {
  appName: string;
  appEnv: AppEnv;
  module: string;
}

export const ENVIRONMENTS = [AppEnv.DEV, AppEnv.PROD];
