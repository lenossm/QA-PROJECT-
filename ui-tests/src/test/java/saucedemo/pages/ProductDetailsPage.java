package saucedemo.pages;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import saucedemo.components.Header;

public class ProductDetailsPage {
    private final Page page;
    public final Header header;

    public ProductDetailsPage(Page page) {
        this.page = page;
        this.header = new Header(page);
    }

    public Locator name() {
        return page.locator("[data-test='inventory-item-name']");
    }

    public Locator description() {
        return page.locator("[data-test='inventory-item-desc']");
    }

    public Locator price() {
        return page.locator("[data-test='inventory-item-price']");
    }

    public Locator addButton() {
        return page.locator("[data-test='add-to-cart']");
    }

    public void addToCart() {
        addButton().click();
    }

    public void backToProducts() {
        page.locator("[data-test='back-to-products']").click();
    }
}
