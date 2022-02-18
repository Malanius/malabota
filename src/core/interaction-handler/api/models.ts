import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export interface ModelsProps {
  api: apigateway.RestApi;
}

export class Models extends Construct {
  public readonly interactionRequest: apigateway.Model;
  public readonly interactionResponse: apigateway.Model;
  public readonly errorResponse: apigateway.Model;
  constructor(scope: Construct, id: string, props: ModelsProps) {
    super(scope, id);

    const { api } = props;

    this.interactionRequest = api.addModel('InteractionRequest', {
      contentType: 'application/json',
      modelName: 'InteractionRequest',
      schema: {
        schema: apigateway.JsonSchemaVersion.DRAFT4,
        title: 'interactionRequest',
        type: apigateway.JsonSchemaType.OBJECT,
        properties: {
          id: { type: apigateway.JsonSchemaType.STRING },
          application_id: { type: apigateway.JsonSchemaType.STRING },
          type: { type: apigateway.JsonSchemaType.INTEGER },
          data: { type: apigateway.JsonSchemaType.OBJECT },
          guild_id: { type: apigateway.JsonSchemaType.STRING },
          channel_id: { type: apigateway.JsonSchemaType.STRING },
          member: { type: apigateway.JsonSchemaType.OBJECT },
          user: { type: apigateway.JsonSchemaType.OBJECT },
          token: { type: apigateway.JsonSchemaType.STRING },
          version: { type: apigateway.JsonSchemaType.INTEGER },
          message: { type: apigateway.JsonSchemaType.OBJECT },
          locale: { type: apigateway.JsonSchemaType.STRING },
          guild_locale: { type: apigateway.JsonSchemaType.STRING },
        },
        required: ['type'],
      },
    });

    this.interactionResponse = api.addModel('InteractionResponse', {
      contentType: 'application/json',
      modelName: 'InteractionResponse',
      schema: {
        schema: apigateway.JsonSchemaVersion.DRAFT4,
        title: 'interactionResponse',
        type: apigateway.JsonSchemaType.OBJECT,
        properties: {
          type: { type: apigateway.JsonSchemaType.INTEGER },
          data: { type: apigateway.JsonSchemaType.OBJECT },
        },
        required: ['type'],
      },
    });
  }
}
