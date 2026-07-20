import { test as base, expect } from '@playwright/test';
import { AuthClient } from '../clients/auth.client';
import { BookingClient } from '../clients/booking.client';
import { buildBooking, type BookingPayload } from '../data/booking.factory';
import { env } from '../utils/env';

interface ApiFixtures {
  authClient: AuthClient;
  bookingClient: BookingClient;
  /** Valid token created once per test from the configured credentials. */
  token: string;
  /**
   * A booking created before the test and deleted afterwards (if the test
   * itself has not already removed it). Tests that need an existing booking
   * use this instead of creating and cleaning up their own.
   */
  existingBooking: { id: number; payload: BookingPayload };
}

export const test = base.extend<ApiFixtures>({
  authClient: async ({ request }, use) => {
    await use(new AuthClient(request));
  },
  bookingClient: async ({ request }, use) => {
    await use(new BookingClient(request));
  },

  token: async ({ authClient }, use) => {
    const response = await authClient.createToken({
      username: env.username,
      password: env.password,
    });
    expect(response.status(), 'auth token request must succeed').toBe(200);
    const body = (await response.json()) as { token?: string };
    expect(body.token, 'auth response must contain a token').toBeTruthy();
    await use(body.token as string);
  },

  existingBooking: async ({ bookingClient, token }, use) => {
    const payload = buildBooking();
    const response = await bookingClient.create(payload);
    expect(response.status(), 'test booking must be created').toBe(200);
    const body = (await response.json()) as { bookingid: number };

    await use({ id: body.bookingid, payload });

    // Cleanup: ignore the outcome deliberately — the booking may already be
    // gone if the test deleted it as part of its scenario.
    await bookingClient.delete(body.bookingid, token);
  },
});

export { expect };
