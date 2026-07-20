import { test, expect } from '../fixtures/api-fixtures';
import { buildBooking, type BookingPayload } from '../data/booking.factory';

test.describe('Booking CRUD — positive', () => {
  test(
    'creates a booking and returns the stored data with an ID',
    { tag: ['@smoke', '@regression'] },
    async ({ bookingClient, token }) => {
      const payload = buildBooking();

      const response = await bookingClient.create(payload);

      expect(response.status()).toBe(200);
      const body = (await response.json()) as { bookingid: number; booking: BookingPayload };
      expect(body.bookingid).toBeGreaterThan(0);
      expect(body.booking).toEqual(payload);

      await bookingClient.delete(body.bookingid, token);
    },
  );

  test(
    'retrieves a booking by ID with all stored fields',
    { tag: ['@smoke', '@regression'] },
    async ({ bookingClient, existingBooking }) => {
      const response = await bookingClient.getById(existingBooking.id);

      expect(response.status()).toBe(200);
      expect((await response.json()) as BookingPayload).toEqual(existingBooking.payload);
    },
  );

  test(
    'booking ID list includes a freshly created booking when filtered by its unique name',
    { tag: ['@regression'] },
    async ({ bookingClient, existingBooking }) => {
      const response = await bookingClient.getIds({
        lastname: existingBooking.payload.lastname,
      });

      expect(response.status()).toBe(200);
      const ids = (await response.json()) as Array<{ bookingid: number }>;
      expect(ids.map((entry) => entry.bookingid)).toContain(existingBooking.id);
    },
  );

  test(
    'full update replaces every field of the booking',
    { tag: ['@regression'] },
    async ({ bookingClient, existingBooking, token }) => {
      const replacement = buildBooking({
        firstname: 'Updated',
        totalprice: 999,
        depositpaid: false,
        additionalneeds: 'Late checkout',
      });

      const response = await bookingClient.update(existingBooking.id, replacement, token);

      expect(response.status()).toBe(200);
      expect((await response.json()) as BookingPayload).toEqual(replacement);

      // The stored resource must reflect the update, not only the PUT response.
      const readBack = await bookingClient.getById(existingBooking.id);
      expect((await readBack.json()) as BookingPayload).toEqual(replacement);
    },
  );

  test(
    'partial update changes only the provided fields',
    { tag: ['@regression'] },
    async ({ bookingClient, existingBooking, token }) => {
      const response = await bookingClient.partialUpdate(
        existingBooking.id,
        { firstname: 'Patched', totalprice: 555 },
        token,
      );

      expect(response.status()).toBe(200);
      const updated = (await response.json()) as BookingPayload;
      expect(updated).toEqual({
        ...existingBooking.payload,
        firstname: 'Patched',
        totalprice: 555,
      });
    },
  );

  test(
    'deleted booking is no longer accessible',
    { tag: ['@smoke', '@regression'] },
    async ({ bookingClient, existingBooking, token }) => {
      // Restful Booker answers 201 Created for a successful DELETE instead of
      // 200/204 — reproduced and documented as DEF-API-002.
      const deleteResponse = await bookingClient.delete(existingBooking.id, token);
      expect(deleteResponse.status()).toBe(201);

      const readBack = await bookingClient.getById(existingBooking.id);
      expect(readBack.status()).toBe(404);
    },
  );
});
