export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface BookingPayload {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

let sequence = 0;

function isoDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().slice(0, 10);
}

/**
 * Builds a unique booking per call. Restful Booker is a shared public
 * instance, so unique last names let tests filter for their own data and
 * never depend on a hardcoded booking ID.
 */
export function buildBooking(overrides: Partial<BookingPayload> = {}): BookingPayload {
  sequence += 1;
  return {
    firstname: 'Elene',
    lastname: `PortfolioTest-${Date.now()}-${sequence}`,
    totalprice: 100 + Math.floor(Math.random() * 900),
    depositpaid: true,
    bookingdates: {
      checkin: isoDate(30),
      checkout: isoDate(35),
    },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}
