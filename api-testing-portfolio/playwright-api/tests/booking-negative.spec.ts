import { test, expect } from '../fixtures/api-fixtures';
import { buildBooking } from '../data/booking.factory';

// A booking ID that is extremely unlikely to exist on the shared instance.
const NONEXISTENT_ID = 99_999_999;

test.describe('Booking — negative scenarios', () => {
  test(
    'retrieving a nonexistent booking returns 404',
    { tag: ['@negative', '@smoke', '@regression'] },
    async ({ bookingClient }) => {
      const response = await bookingClient.getById(NONEXISTENT_ID);

      expect(response.status()).toBe(404);
    },
  );

  test(
    'updating a nonexistent booking is refused',
    { tag: ['@negative', '@regression'] },
    async ({ bookingClient, token }) => {
      const response = await bookingClient.update(NONEXISTENT_ID, buildBooking(), token);

      // 405 instead of the conventional 404 — actual behaviour, documented
      // as DEF-API-003 in docs/defect-samples.md.
      expect(response.status()).toBe(405);
    },
  );

  test(
    'deleting a nonexistent booking is refused',
    { tag: ['@negative', '@regression'] },
    async ({ bookingClient, token }) => {
      const response = await bookingClient.delete(NONEXISTENT_ID, token);

      expect(response.status()).toBe(405);
    },
  );

  test(
    'update without authentication returns 403',
    { tag: ['@negative', '@smoke', '@regression'] },
    async ({ bookingClient, existingBooking }) => {
      const response = await bookingClient.update(existingBooking.id, buildBooking());

      expect(response.status()).toBe(403);

      // The booking must be untouched after the refused update.
      const readBack = await bookingClient.getById(existingBooking.id);
      expect(await readBack.json()).toEqual(existingBooking.payload);
    },
  );

  test(
    'delete without authentication returns 403 and keeps the booking',
    { tag: ['@negative', '@regression'] },
    async ({ bookingClient, existingBooking }) => {
      const response = await bookingClient.delete(existingBooking.id);

      expect(response.status()).toBe(403);

      const readBack = await bookingClient.getById(existingBooking.id);
      expect(readBack.status()).toBe(200);
    },
  );

  test(
    'update with an invalid token returns 403',
    { tag: ['@negative', '@regression'] },
    async ({ bookingClient, existingBooking }) => {
      const response = await bookingClient.update(
        existingBooking.id,
        buildBooking(),
        'invalid-token-123',
      );

      expect(response.status()).toBe(403);
    },
  );

  test(
    'creating a booking without mandatory fields fails',
    { tag: ['@negative', '@regression'] },
    async ({ bookingClient }) => {
      const response = await bookingClient.createPartial({ firstname: 'OnlyFirstName' });

      // The API crashes with 500 instead of validating with 400 — reproduced
      // and documented as DEF-API-004.
      expect(response.status()).toBe(500);
    },
  );

  test(
    'creating a booking with a wrongly typed price is not stored faithfully',
    { tag: ['@negative', '@regression'] },
    async ({ bookingClient, token }) => {
      const payload = { ...buildBooking(), totalprice: 'not-a-number' };

      const response = await bookingClient.createPartial(payload);

      // The API accepts the payload (200) but silently corrupts the value to
      // null — reproduced and documented as DEF-API-005. The assertion pins
      // the actual behaviour so any change is noticed.
      expect(response.status()).toBe(200);
      const body = (await response.json()) as {
        bookingid: number;
        booking: { totalprice: unknown };
      };
      expect(body.booking.totalprice).toBeNull();

      await bookingClient.delete(body.bookingid, token);
    },
  );

  test(
    'creating a booking with an invalid check-in date is not rejected',
    { tag: ['@negative', '@regression'] },
    async ({ bookingClient, token }) => {
      const payload = buildBooking();
      payload.bookingdates = { checkin: 'not-a-date', checkout: payload.bookingdates.checkout };

      const response = await bookingClient.createPartial(
        payload as unknown as Record<string, unknown>,
      );

      // Accepted and stored as "0NaN-aN-aN" — reproduced and documented as
      // DEF-API-006.
      expect(response.status()).toBe(200);
      const body = (await response.json()) as {
        bookingid: number;
        booking: { bookingdates: { checkin: string } };
      };
      expect(body.booking.bookingdates.checkin).toBe('0NaN-aN-aN');

      await bookingClient.delete(body.bookingid, token);
    },
  );

  test(
    'malformed JSON body returns 400',
    { tag: ['@negative', '@regression'] },
    async ({ bookingClient }) => {
      const response = await bookingClient.createRaw('{"firstname": ');

      expect(response.status()).toBe(400);
    },
  );

  test(
    'empty request body is rejected with 400',
    { tag: ['@negative', '@regression'] },
    async ({ bookingClient }) => {
      const response = await bookingClient.createRaw('');

      expect(response.status()).toBe(400);
    },
  );
});
