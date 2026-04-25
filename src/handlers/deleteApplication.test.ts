import { handler } from './deleteApplication';

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
        .mockRejectedValueOnce(new Error('DB error')),
    }),
  },
  DeleteCommand: jest.fn(),
}));

describe('deleteApplication handler', () => {
  test('returns 204 when application deleted successfully', async () => {
    const event = {
      pathParameters: { id: '123' },
    };
    const response = await handler(event);
    expect(response.statusCode).toBe(204);
  });

  test('returns 500 when internal server error occurs', async () => {
    const event = {
      pathParameters: { id: '123' },
    };
    const response = await handler(event);
    expect(response.statusCode).toBe(500);
  });
});
