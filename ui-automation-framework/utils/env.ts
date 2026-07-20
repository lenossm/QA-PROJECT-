import dotenv from 'dotenv';

dotenv.config();

/**
 * Central access point for environment configuration.
 * Defaults match the public SauceDemo demo credentials so the suite runs
 * out of the box; a real project would fail fast instead of falling back.
 */
export const env = {
  baseUrl: process.env.BASE_URL ?? 'https://www.saucedemo.com',
  standardUser: process.env.STANDARD_USER ?? 'standard_user',
  lockedOutUser: process.env.LOCKED_OUT_USER ?? 'locked_out_user',
  problemUser: process.env.PROBLEM_USER ?? 'problem_user',
  password: process.env.SAUCE_PASSWORD ?? 'secret_sauce',
} as const;
