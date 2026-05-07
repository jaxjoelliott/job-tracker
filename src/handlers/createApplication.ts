import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: {
  body: string;
}): Promise<{ statusCode: number; body: string }> => {
  try {
    const body = JSON.parse(event.body);
    console.log(
      JSON.stringify({
        level: 'INFO',
        function: 'createApplication',
        message: 'Request received',
        input: body,
      }),
    );
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
    console.log(
      JSON.stringify({
        level: 'INFO',
        function: 'createApplication',
        message: 'Application created successfully',
        input: body,
      }),
    );
    return {
      statusCode: 201,
      body: JSON.stringify({ id }),
    };
  } catch (_error) {
    console.log(
      JSON.stringify({
        level: 'ERROR',
        function: 'createApplication',
        error: _error.message,
        input: body,
      }),
    );
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid request body' }),
    };
  }
};
