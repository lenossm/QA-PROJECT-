import { test, expect } from '../fixtures/api-fixtures';
import {
  bookingSchema,
  createdBookingSchema,
  bookingIdListSchema,
} from '../schemas/booking.schemas';
import { assertMatchesSchema } from '../utils/schema-validator';
import { buildBooking } from '../data/booking.factory';
import { env } from '../utils/env';

test.describe('Contract and response validation', () => {
  test(
    'create-booking response matches the documented JSON schema',
    { tag: ['@regression'] },
    async ({ bookingClient, token }) => {
      const response = await bookingClient.create(buildBooking());

      expect(response.status()).toBe(200);
      const body = (await response.json()) as { bookingid: number };
      assertMatchesSchema(body, createdBookingSchema, 'POST /booking response');

      await bookingClient.delete(body.bookingid, token);
    },
  );

  test(
    'get-booking response matches the booking schema and field types',
    { tag: ['@regression'] },
    async ({ bookingClient, existingBooking }) => {
      const response = await bookingClient.getById(existingBooking.id);

      expect(response.status()).toBe(200);
      const body: unknown = await response.json();
      assertMatchesSchema(body, bookingSchema, `GET /booking/${existingBooking.id} response`);
    },
  );

  test(
    'booking ID list matches its schema and is non-empty',
    { tag: ['@regression'] },
    async ({ bookingClient }) => {
      const response = await bookingClient.getIds();

      expect(response.status()).toBe(200);
      const body: unknown = await response.json();
      assertMatchesSchema(body, bookingIdListSchema, 'GET /booking response');
      expect(Array.isArray(body) && body.length).toBeGreaterThan(0);
    },
  );

  test(
    'read endpoints send a JSON content type header',
    { tag: ['@regression'] },
    async ({ bookingClient, existingBooking }) => {
      const response = await bookingClient.getById(existingBooking.id);

      expect(response.headers()['content-type']).toContain('application/json');
      expect(response.headers()['content-type']).toContain('charset=utf-8');
    },
  );

  test(
    `GET /booking/{id} responds within the documented ${env.responseTimeBudgetMs} ms budget`,
    { tag: ['@regression'] },
    async ({ bookingClient, existingBooking }) => {
      // Coarse client-side timing: enough to catch order-of-magnitude
      // regressions on a free-tier host, not a load test.
      const startedAt = Date.now();
      const response = await bookingClient.getById(existingBooking.id);
      const elapsedMs = Date.now() - startedAt;

      expect(response.status()).toBe(200);
      expect(elapsedMs).toBeLessThan(env.responseTimeBudgetMs);
    },
  );

  test(
    'values returned by create and update stay consistent with what was sent',
    { tag: ['@regression'] },
    async ({ bookingClient, existingBooking, token }) => {
      // Round-trip consistency on top of schema validity: stored values must
      // equal sent values before and after an update.
      const firstRead = (await (await bookingClient.getById(existingBooking.id)).json()) as unknown;
      expect(firstRead).toEqual(existingBooking.payload);

      const updatedPayload = buildBooking({ totalprice: 321 });
      await bookingClient.update(existingBooking.id, updatedPayload, token);

      const secondRead = (await (
        await bookingClient.getById(existingBooking.id)
      ).json()) as unknown;
      expect(secondRead).toEqual(updatedPayload);
    },
  );
});
