import { env } from '../utils/env';

export interface Credentials {
  username: string;
  password: string;
}

export const users = {
  standard: { username: env.standardUser, password: env.password },
  lockedOut: { username: env.lockedOutUser, password: env.password },
} satisfies Record<string, Credentials>;

/** Error messages rendered by SauceDemo's login form. */
export const loginErrors = {
  wrongCredentials: 'Epic sadface: Username and password do not match any user in this service',
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
} as const;
