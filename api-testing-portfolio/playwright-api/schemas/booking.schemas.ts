/**
 * JSON schemas describing the Restful Booker response contracts, derived
 * from the API documentation and verified against live responses.
 */

export const bookingSchema = {
  type: 'object',
  required: ['firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates'],
  properties: {
    firstname: { type: 'string' },
    lastname: { type: 'string' },
    totalprice: { type: 'number' },
    depositpaid: { type: 'boolean' },
    bookingdates: {
      type: 'object',
      required: ['checkin', 'checkout'],
      properties: {
        checkin: { type: 'string', format: 'date' },
        checkout: { type: 'string', format: 'date' },
      },
      additionalProperties: false,
    },
    additionalneeds: { type: 'string' },
  },
  additionalProperties: false,
} as const;

export const createdBookingSchema = {
  type: 'object',
  required: ['bookingid', 'booking'],
  properties: {
    bookingid: { type: 'integer', minimum: 1 },
    booking: bookingSchema,
  },
  additionalProperties: false,
} as const;

export const bookingIdListSchema = {
  type: 'array',
  items: {
    type: 'object',
    required: ['bookingid'],
    properties: {
      bookingid: { type: 'integer' },
    },
    additionalProperties: false,
  },
} as const;

export const authTokenSchema = {
  type: 'object',
  required: ['token'],
  properties: {
    token: { type: 'string', minLength: 1 },
  },
  additionalProperties: false,
} as const;
