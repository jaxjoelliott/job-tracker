import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (): Promise<{
  statusCode: number;
  body: string;
}> => {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: process.env.TABLE_NAME,
        ProjectionExpression: 'id, company, position, status, date_applied',
      }),
    );
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (_error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Failed to list applications' }),
    };
  }
};
