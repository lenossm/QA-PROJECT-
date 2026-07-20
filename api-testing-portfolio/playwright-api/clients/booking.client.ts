import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { BookingPayload } from '../data/booking.factory';

/**
 * Restful Booker authenticates write operations with a token passed in a
 * Cookie header. The client accepts the token per call so the same instance
 * can exercise authenticated, unauthenticated and invalid-token scenarios.
 */
export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  private authHeaders(token?: string): Record<string, string> {
    return token ? { Cookie: `token=${token}` } : {};
  }

  async create(booking: BookingPayload): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking });
  }

  /** Sends a raw (potentially malformed) body instead of a JSON object. */
  async createRaw(rawBody: string): Promise<APIResponse> {
    return this.request.post('/booking', {
      headers: { 'Content-Type': 'application/json' },
      data: rawBody,
    });
  }

  /** Allows arbitrary payload shapes for negative tests (missing/typed-wrong fields). */
  async createPartial(payload: Record<string, unknown>): Promise<APIResponse> {
    return this.request.post('/booking', { data: payload });
  }

  async getById(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  async getIds(filters: Record<string, string> = {}): Promise<APIResponse> {
    return this.request.get('/booking', { params: filters });
  }

  async update(id: number, booking: BookingPayload, token?: string): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, {
      headers: this.authHeaders(token),
      data: booking,
    });
  }

  async partialUpdate(
    id: number,
    partial: Partial<BookingPayload>,
    token?: string,
  ): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, {
      headers: this.authHeaders(token),
      data: partial,
    });
  }

  async delete(id: number, token?: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, { headers: this.authHeaders(token) });
  }
}
