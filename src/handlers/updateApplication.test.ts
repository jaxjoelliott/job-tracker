import { handler } from './updateApplication';

jest.mock('@aws-sdk/lib-dynamodb', () => ({
  DynamoDBDocumentClient: {
    from: jest.fn().mockReturnValue({
      send: jest
        .fn()
        .mockResolvedValueOnce({
          Attributes: {
            id: '123',
            company: 'Google',
            position: 'Engineer',
          },
        })
        .mockResolvedValueOnce({ Attributes: undefined }),
    }),
  },
  UpdateCommand: jest.fn(),
}));

describe('getApplication handler', () => {
  test('returns 200 with updated attribute', async () => {
    const event = {
      pathParameters: { id: '123' },
      body: JSON.stringify({ company: 'Google', position: 'Engineer' }),
    };
    const response = await handler(event);
    expect(response.statusCode).toBe(200);
  });

  test('returns 404 when application not found', async () => {
    const event = {
      pathParameters: { id: 'nonexistent' },
      body: JSON.stringify({ company: 'Google', position: 'Engineer' }),
    };
    const response = await handler(event);
    expect(response.statusCode).toBe(404);
  });
});
