import { handler } from './getApplication';

jest.mock('@aws-sdk/lib-dynamodb', () => ({
  DynamoDBDocumentClient: {
    from: jest.fn().mockReturnValue({
      send: jest
        .fn()
        .mockResolvedValueOnce({
          Item: {
            id: '123',
            company: 'Google',
            position: 'Engineer',
            status: 'submitted',
            date_applied: '2026-04-21',
          },
        })
        .mockResolvedValueOnce({ Item: undefined }),
    }),
  },
  GetCommand: jest.fn(),
}));

describe('getApplication handler', () => {
  test('returns 200 with application on valid request', async () => {
    const event = { pathParameters: { id: '123' } };
    const response = await handler(event);
    expect(response.statusCode).toBe(200);
  });

  test('returns 404 when application not found', async () => {
    const event = { pathParameters: { id: 'nonexistent' } };
    const response = await handler(event);
    expect(response.statusCode).toBe(404);
  });
});
