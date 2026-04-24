import { handler } from './listApplications';

jest.mock('@aws-sdk/lib-dynamodb', () => ({
  DynamoDBDocumentClient: {
    from: jest.fn().mockReturnValue({
      send: jest.fn().mockResolvedValue({
        Items: [
          {
            id: '123',
            company: 'Google',
            position: 'Engineer',
            status: 'submitted',
            date_applied: '2026-04-21',
          },
        ],
      }),
    }),
  },
  ScanCommand: jest.fn(),
}));

describe('listApplications handler', () => {
  test('returns 200 with applications on valid request', async () => {
    const response = await handler();
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toBeInstanceOf(Array);
  });
});
