import dotenv from 'dotenv';

dotenv.config();

/**
 * Central access point for environment configuration.
 * Defaults match Restful Booker's published training credentials so the
 * suite runs out of the box; a real project would fail fast instead.
 */
export const env = {
  baseUrl: process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com',
  username: process.env.API_USERNAME ?? 'admin',
  password: process.env.API_PASSWORD ?? 'password123',
  responseTimeBudgetMs: Number(process.env.RESPONSE_TIME_BUDGET_MS ?? 5000),
} as const;
