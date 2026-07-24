package saucedemo.pages;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;

public class LoginPage {
    private final Page page;

    public LoginPage(Page page) {
        this.page = page;
    }

    public void open() {
        page.navigate("/");
    }

    public Locator usernameField() {
        return page.locator("[data-test='username']");
    }

    public Locator passwordField() {
        return page.locator("[data-test='password']");
    }

    public Locator loginButton() {
        return page.locator("[data-test='login-button']");
    }

    public Locator error() {
        return page.locator("[data-test='error']");
    }

    public Locator errorClose() {
        return page.locator("[data-test='error-button']");
    }

    public void login(String user, String pass) {
        if (user != null && !user.isEmpty()) {
            usernameField().fill(user);
        }
        if (pass != null && !pass.isEmpty()) {
            passwordField().fill(pass);
        }
        loginButton().click();
    }
}
