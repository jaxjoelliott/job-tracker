import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: {
  pathParameters: { id: string };
  body: string;
}): Promise<{
  statusCode: number;
  body: string;
}> => {
  try {
    console.log(
      JSON.stringify({
        level: 'INFO',
        function: 'updateApplication',
        message: 'Request received',
        input: event.pathParameters,
      }),
    );
    const body = JSON.parse(event.body);
    const result = await docClient.send(
      new UpdateCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: event.pathParameters.id,
        },
        UpdateExpression: 'SET #company = :company, #position = :position',
        ExpressionAttributeNames: {
          '#company': 'company',
          '#position': 'position',
        },
        ExpressionAttributeValues: {
          ':company': body.company,
          ':position': body.position,
        },
        ReturnValues: 'ALL_NEW',
      }),
    );

    if (!result.Attributes) {
      console.log(
        JSON.stringify({
          level: 'ERROR',
          function: 'updateApplication',
          message: 'Failed to update application',
          input: event.pathParameters,
        }),
      );
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Application not found' }),
      };
    }

    console.log(
      JSON.stringify({
        level: 'INFO',
        function: 'updateApplication',
        message: 'Application updated successfully',
        input: event.pathParameters,
        updatedAttributes: result.Attributes,
      }),
    );

    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (_error) {
    console.log(
      JSON.stringify({
        level: 'ERROR',
        function: 'updateApplication',
        error: (_error as Error).message,
        input: event.pathParameters,
      }),
    );
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
