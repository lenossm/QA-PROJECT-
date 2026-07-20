import { test, expect } from '../../fixtures/test';
import { loginErrors } from '../../data/users';

test.describe('Authentication', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test(
    'successful login with valid credentials lands on the inventory page',
    { tag: ['@smoke', '@regression'] },
    async ({ loginPage, inventoryPage, standardUser }) => {
      await loginPage.login(standardUser);

      await expect(inventoryPage.page).toHaveURL(/inventory\.html/);
      await expect(inventoryPage.header.title).toHaveText('Products');
      await expect(inventoryPage.inventoryList).toBeVisible();
    },
  );

  test(
    'login with an invalid password is rejected',
    { tag: ['@negative', '@regression'] },
    async ({ loginPage, standardUser }) => {
      await loginPage.login({ username: standardUser.username, password: 'wrong_password' });

      await expect(loginPage.errorMessage).toHaveText(loginErrors.wrongCredentials);
      await expect(loginPage.page).toHaveURL('/');
    },
  );

  test(
    'login with an empty username shows the username-required message',
    { tag: ['@negative', '@regression'] },
    async ({ loginPage, standardUser }) => {
      await loginPage.login({ username: '', password: standardUser.password });

      await expect(loginPage.errorMessage).toHaveText(loginErrors.usernameRequired);
    },
  );

  test(
    'login with an empty password shows the password-required message',
    { tag: ['@negative', '@regression'] },
    async ({ loginPage, standardUser }) => {
      await loginPage.login({ username: standardUser.username, password: '' });

      await expect(loginPage.errorMessage).toHaveText(loginErrors.passwordRequired);
    },
  );

  test(
    'login with both fields empty reports the username first',
    { tag: ['@negative', '@regression'] },
    async ({ loginPage }) => {
      await loginPage.login({ username: '', password: '' });

      await expect(loginPage.errorMessage).toHaveText(loginErrors.usernameRequired);
    },
  );

  test(
    'locked-out user cannot log in and sees the locked-out message',
    { tag: ['@negative', '@smoke', '@regression'] },
    async ({ loginPage, lockedOutUser }) => {
      await loginPage.login(lockedOutUser);

      await expect(loginPage.errorMessage).toHaveText(loginErrors.lockedOut);
      await expect(loginPage.page).toHaveURL('/');
    },
  );

  test(
    'validation message can be dismissed and login retried successfully',
    { tag: ['@regression'] },
    async ({ loginPage, inventoryPage, standardUser }) => {
      await loginPage.login({ username: standardUser.username, password: 'wrong_password' });
      await expect(loginPage.errorMessage).toBeVisible();

      await loginPage.errorCloseButton.click();
      await expect(loginPage.errorMessage).toBeHidden();

      await loginPage.passwordInput.fill(standardUser.password);
      await loginPage.loginButton.click();
      await expect(inventoryPage.inventoryList).toBeVisible();
    },
  );
});

test.describe('Logout', () => {
  test(
    'logout returns to the login page and ends the session',
    { tag: ['@smoke', '@regression'] },
    async ({ authenticatedPage, loginPage }) => {
      await authenticatedPage.header.logout();

      await expect(loginPage.loginButton).toBeVisible();
      await expect(loginPage.page).toHaveURL('/');

      // Session must actually be gone: deep-linking back must be refused.
      await authenticatedPage.goto();
      await expect(loginPage.errorMessage).toContainText('You can only access');
    },
  );
});
