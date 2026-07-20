import type { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * Thin wrapper around the /auth endpoint. Clients own URLs and request
 * shaping only — every assertion stays in the tests.
 */
export class AuthClient {
  constructor(private readonly request: APIRequestContext) {}

  async createToken(credentials: { username?: string; password?: string }): Promise<APIResponse> {
    return this.request.post('/auth', { data: credentials });
  }

  /** Sends a raw (potentially malformed) body instead of a JSON object. */
  async createTokenRaw(rawBody: string): Promise<APIResponse> {
    return this.request.post('/auth', {
      headers: { 'Content-Type': 'application/json' },
      data: rawBody,
    });
  }
}
