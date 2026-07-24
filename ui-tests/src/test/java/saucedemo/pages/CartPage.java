package saucedemo.pages;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import saucedemo.components.Header;
import saucedemo.components.ProductItem;

public class CartPage {
    private final Page page;
    public final Header header;

    public CartPage(Page page) {
        this.page = page;
        this.header = new Header(page);
    }

    public void open() {
        page.navigate("/cart.html");
    }

    public Locator items() {
        return page.locator("[data-test='inventory-item']");
    }

    public ProductItem item(String name) {
        for (int i = 0; i < items().count(); i++) {
            Locator one = items().nth(i);
            if (one.locator("[data-test='inventory-item-name']").innerText().equals(name)) {
                return new ProductItem(one);
            }
        }
        throw new RuntimeException("item not in cart: " + name);
    }

    public String quantityOf(String name) {
        Locator row = null;
        for (int i = 0; i < items().count(); i++) {
            Locator one = items().nth(i);
            if (one.locator("[data-test='inventory-item-name']").innerText().equals(name)) {
                row = one;
                break;
            }
        }
        if (row == null) {
            throw new RuntimeException("item not in cart: " + name);
        }
        return row.locator("[data-test='item-quantity']").innerText();
    }

    public void removeItem(String name) {
        item(name).removeFromCart();
    }

    public void continueShopping() {
        page.locator("[data-test='continue-shopping']").click();
    }

    public void startCheckout() {
        page.locator("[data-test='checkout']").click();
    }
}
