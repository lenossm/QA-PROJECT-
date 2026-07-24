package saucedemo.tests;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import saucedemo.base.BaseTest;
import saucedemo.data.Users;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class LoginTest extends BaseTest {

    @Test
    @Tag("smoke")
    @Tag("regression")
    void successfulLoginGoesToInventory() {
        loginPage.open();
        loginPage.login(Users.STANDARD, Users.PASSWORD);

        assertTrue(page.url().contains("/inventory.html"));
        assertEquals("Products", inventoryPage.header.title().innerText());
        assertTrue(inventoryPage.list().isVisible());
    }

    @Test
    @Tag("negative")
    @Tag("regression")
    void wrongPasswordShowsError() {
        loginPage.open();
        loginPage.login(Users.STANDARD, "wrong_password");

        assertEquals(Users.ERR_WRONG, loginPage.error().innerText());
        assertTrue(page.url().endsWith("saucedemo.com/") || page.url().endsWith("saucedemo.com"));
    }

    @Test
    @Tag("negative")
    @Tag("regression")
    void emptyUsernameShowsError() {
        loginPage.open();
        loginPage.login("", Users.PASSWORD);
        assertEquals(Users.ERR_USER_REQUIRED, loginPage.error().innerText());
    }

    @Test
    @Tag("negative")
    @Tag("regression")
    void emptyPasswordShowsError() {
        loginPage.open();
        loginPage.login(Users.STANDARD, "");
        assertEquals(Users.ERR_PASS_REQUIRED, loginPage.error().innerText());
    }

    @Test
    @Tag("negative")
    @Tag("regression")
    void bothEmptyShowsUsernameErrorFirst() {
        loginPage.open();
        loginPage.login("", "");
        assertEquals(Users.ERR_USER_REQUIRED, loginPage.error().innerText());
    }

    @Test
    @Tag("negative")
    @Tag("smoke")
    @Tag("regression")
    void lockedOutUserCannotLogin() {
        loginPage.open();
        loginPage.login(Users.LOCKED_OUT, Users.PASSWORD);

        assertEquals(Users.ERR_LOCKED, loginPage.error().innerText());
        assertFalse(page.url().contains("/inventory.html"));
    }

    @Test
    @Tag("regression")
    void canDismissErrorAndLoginAgain() {
        loginPage.open();
        loginPage.login(Users.STANDARD, "wrong_password");
        assertTrue(loginPage.error().isVisible());

        loginPage.errorClose().click();
        assertFalse(loginPage.error().isVisible());

        loginPage.login(Users.STANDARD, Users.PASSWORD);
        assertTrue(inventoryPage.list().isVisible());
    }

    @Test
    @Tag("smoke")
    @Tag("regression")
    void logoutReturnsToLoginAndBlocksInventory() {
        loginAsStandardUser();
        inventoryPage.header.logout();

        assertTrue(loginPage.loginButton().isVisible());
        assertTrue(page.url().contains("saucedemo.com"));

        // try opening inventory without being logged in
        inventoryPage.open();
        assertTrue(loginPage.error().innerText().contains("You can only access"));
    }
}
