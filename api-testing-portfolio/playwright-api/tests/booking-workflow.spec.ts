import { test, expect } from '../fixtures/api-fixtures';
import { buildBooking, type BookingPayload } from '../data/booking.factory';
import { env } from '../utils/env';

/**
 * Full booking lifecycle in one dynamic workflow. Unlike the focused CRUD
 * tests, this intentionally chains every step against the same booking:
 * token → create → read → full update → partial update → delete → verify 404.
 * All data is generated at runtime; nothing relies on pre-existing IDs.
 */
test.describe('Booking lifecycle workflow', () => {
  test(
    'complete lifecycle: create, read, update, patch, delete, verify deletion',
    { tag: ['@e2e', '@smoke', '@regression'] },
    async ({ authClient, bookingClient }) => {
      let token = '';
      let bookingId = 0;
      const original = buildBooking();

      await test.step('Create an authentication token', async () => {
        const response = await authClient.createToken({
          username: env.username,
          password: env.password,
        });
        expect(response.status()).toBe(200);
        token = ((await response.json()) as { token: string }).token;
        expect(token).not.toBe('');
      });

      await test.step('Create a booking with generated data', async () => {
        const response = await bookingClient.create(original);
        expect(response.status()).toBe(200);
        const body = (await response.json()) as { bookingid: number; booking: BookingPayload };
        expect(body.booking).toEqual(original);
        bookingId = body.bookingid;
        expect(bookingId).toBeGreaterThan(0);
      });

      await test.step('Retrieve the booking by its generated ID', async () => {
        const response = await bookingClient.getById(bookingId);
        expect(response.status()).toBe(200);
        expect((await response.json()) as BookingPayload).toEqual(original);
      });

      const replacement = buildBooking({ firstname: 'Lifecycle', totalprice: 777 });

      await test.step('Fully update the booking and verify the new values', async () => {
        const response = await bookingClient.update(bookingId, replacement, token);
        expect(response.status()).toBe(200);
        expect((await response.json()) as BookingPayload).toEqual(replacement);
      });

      await test.step('Partially update one field and verify the merge', async () => {
        const response = await bookingClient.partialUpdate(
          bookingId,
          { additionalneeds: 'Airport transfer' },
          token,
        );
        expect(response.status()).toBe(200);
        expect((await response.json()) as BookingPayload).toEqual({
          ...replacement,
          additionalneeds: 'Airport transfer',
        });
      });

      await test.step('Delete the booking', async () => {
        const response = await bookingClient.delete(bookingId, token);
        expect(response.status()).toBe(201);
      });

      await test.step('Verify the booking is gone', async () => {
        const response = await bookingClient.getById(bookingId);
        expect(response.status()).toBe(404);
      });
    },
  );
});
