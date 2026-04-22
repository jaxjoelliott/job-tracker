import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: { body: string }) => {
  try {
    const body = JSON.parse(event.body);
    const id = crypto.randomUUID();
    await docClient.send(
      new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
          id,
          date_applied: body.date_applied,
          status: body.status,
          company: body.company,
          position: body.position,
          wage: body.wage,
          link: body.link,
          contact: body.contact,
          free_notes: body.free_notes,
        },
      }),
    );
    return {
      statusCode: 201,
      body: JSON.stringify({ id }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid request body' }),
    };
  }
};
