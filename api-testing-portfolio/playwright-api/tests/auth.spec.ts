import { test, expect } from '../fixtures/api-fixtures';
import { authTokenSchema } from '../schemas/booking.schemas';
import { assertMatchesSchema } from '../utils/schema-validator';
import { env } from '../utils/env';

test.describe('Authentication — positive', () => {
  test(
    'creates a token with valid credentials',
    { tag: ['@smoke', '@regression'] },
    async ({ authClient }) => {
      const response = await authClient.createToken({
        username: env.username,
        password: env.password,
      });

      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');

      const body: unknown = await response.json();
      assertMatchesSchema(body, authTokenSchema, 'Auth token response');
      expect((body as { token: string }).token.length).toBeGreaterThan(0);
    },
  );
});

test.describe('Authentication — negative', () => {
  // Restful Booker responds 200 + {"reason": "Bad credentials"} instead of
  // 401 for every credential failure. The tests assert this actual behaviour;
  // the deviation from REST conventions is documented as DEF-API-001 in
  // docs/defect-samples.md.
  const badCredentialCases = [
    {
      name: 'invalid username is rejected',
      credentials: { username: 'not_a_real_user', password: env.password },
    },
    {
      name: 'invalid password is rejected',
      credentials: { username: env.username, password: 'wrong_password' },
    },
    {
      name: 'missing credentials are rejected',
      credentials: {},
    },
  ];

  for (const { name, credentials } of badCredentialCases) {
    test(name, { tag: ['@negative', '@regression'] }, async ({ authClient }) => {
      const response = await authClient.createToken(credentials);

      expect(response.status()).toBe(200);
      const body = (await response.json()) as Record<string, unknown>;
      expect(body).toEqual({ reason: 'Bad credentials' });
      expect(body).not.toHaveProperty('token');
    });
  }

  test(
    'malformed JSON body is rejected with 400',
    { tag: ['@negative', '@regression'] },
    async ({ authClient }) => {
      const response = await authClient.createTokenRaw('{"username": "admin", ');

      expect(response.status()).toBe(400);
    },
  );
});
