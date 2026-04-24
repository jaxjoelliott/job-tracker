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
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Application not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (_error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
