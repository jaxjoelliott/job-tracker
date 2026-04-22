import { handler } from './createApplication';

jest.mock('@aws-sdk/lib-dynamodb', () => ({
  DynamoDBDocumentClient: {
    from: jest.fn().mockReturnValue({
      send: jest.fn().mockResolvedValue({}),
    }),
  },
  PutCommand: jest.fn(),
}));

jest
  .spyOn(crypto, 'randomUUID')
  .mockReturnValue('123e4567-e89b-12d3-a456-426614174000');

const event = {
  body: JSON.stringify({
    company: 'Google',
    position: 'Software Engineer',
    status: 'submitted',
    date_applied: '2026-04-21',
    wage: '150000',
    link: 'https://google.com',
    contact: 'recruiter@google.com',
    free_notes: 'Applied online',
  }),
};

const badEvent = {
  body: 'not valid json{{{{',
};

describe('createApplication handler', () => {
  test('returns 201 with id on valid input', async () => {
    const response = await handler(event);
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toHaveProperty(
      'id',
      '123e4567-e89b-12d3-a456-426614174000',
    );
  });

  test('returns 400 for malformed body', async () => {
    const badEvent = { body: 'not valid json{{{{' };
    const response = await handler(badEvent);
    expect(response.statusCode).toBe(400);
  });
});
