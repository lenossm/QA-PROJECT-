import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './playwright-api/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Restful Booker is a shared public instance that occasionally returns
  // transient 5xx errors, so one retry is allowed even locally.
  retries: process.env.CI ? 2 : 1,
  workers: 4,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com',
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  },
});
