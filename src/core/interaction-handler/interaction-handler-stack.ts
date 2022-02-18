import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as pylambda from '@aws-cdk/aws-lambda-python-alpha';
import { Construct } from 'constructs';

import { AppInfo } from '../../common/app-info';
import { Models } from './api/models';

export interface InteractionHandlerStackProps extends cdk.StackProps, AppInfo {}

export class InteractionHandlerStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: InteractionHandlerStackProps
  ) {
    super(scope, id, props);

    const { appName, appEnv, module } = props;

    const interactionLambda = new pylambda.PythonFunction(
      this,
      'InteractionLambda',
      {
        functionName: `${appName}-${appEnv}-${module}-interaction-handler`,
        entry: 'lamdbas/core/interaction-handler/',
        runtime: lambda.Runtime.PYTHON_3_9,
        architecture: lambda.Architecture.X86_64,
        layers: [
          lambda.LayerVersion.fromLayerVersionArn(
            this,
            'PowertoolsLayer',
            `arn:aws:lambda:${this.region}:017000801446:layer:AWSLambdaPowertoolsPython:11`
          ),
        ],
        logRetention: cdk.aws_logs.RetentionDays.ONE_MONTH,
      }
    );

    // API
    const api = new apigateway.RestApi(this, 'apigateway', {
      restApiName: `${appName}-${appEnv}`,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
      deployOptions: {
        stageName: appEnv,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        tracingEnabled: true,
      },
    });

    // Request templates
    const requestTemplates = {
      'application/json': '{ "statusCode": "200" }',
    };

    const requestValidator = api.addRequestValidator('RequestValidator', {
      validateRequestBody: true,
      validateRequestParameters: true,
    });

    const models = new Models(this, 'Models', { api });

    // /events
    const eventsResource = api.root.addResource('events');

    const postEventIntegration = new apigateway.LambdaIntegration(
      interactionLambda,
      {
        requestTemplates,
      }
    );

    // POST /events
    eventsResource.addMethod('POST', postEventIntegration, {
      operationName: 'Send event',
      requestValidator,
      requestParameters: {
        'method.request.header.X-Signature-Ed25519': true,
        'method.request.header.X-Signature-Timestamp': true,
      },
      requestModels: {
        'application/json': models.interactionRequest,
      },
      methodResponses: [
        {
          statusCode: '200',
          responseModels: { 'application/json': models.interactionResponse },
        },
        {
          statusCode: '401',
          responseModels: { 'application/json': apigateway.Model.ERROR_MODEL },
        },
      ],
    });
  }
}
