package saucedemo.components;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;

public class Header {
    private final Page page;

    public Header(Page page) {
        this.page = page;
    }

    public Locator title() {
        return page.locator("[data-test='title']");
    }

    public Locator cartLink() {
        return page.locator("[data-test='shopping-cart-link']");
    }

    public Locator cartBadge() {
        return page.locator("[data-test='shopping-cart-badge']");
    }

    public void openCart() {
        cartLink().click();
    }

    public void logout() {
        page.getByRole(com.microsoft.playwright.options.AriaRole.BUTTON,
                new Page.GetByRoleOptions().setName("Open Menu")).click();
        page.locator("[data-test='logout-sidebar-link']").click();
    }
}
