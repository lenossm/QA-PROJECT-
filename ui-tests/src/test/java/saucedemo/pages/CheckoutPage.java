package saucedemo.pages;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import saucedemo.components.Header;
import saucedemo.components.ProductItem;

public class CheckoutPage {
    private final Page page;
    public final Header header;

    public CheckoutPage(Page page) {
        this.page = page;
        this.header = new Header(page);
    }

    // step 1
    public Locator firstName() {
        return page.locator("[data-test='firstName']");
    }

    public Locator lastName() {
        return page.locator("[data-test='lastName']");
    }

    public Locator postalCode() {
        return page.locator("[data-test='postalCode']");
    }

    public Locator error() {
        return page.locator("[data-test='error']");
    }

    public void fillInfo(String first, String last, String postal) {
        if (first != null) {
            firstName().fill(first);
        }
        if (last != null) {
            lastName().fill(last);
        }
        if (postal != null) {
            postalCode().fill(postal);
        }
    }

    public void continueCheckout() {
        page.locator("[data-test='continue']").click();
    }

    public void cancel() {
        page.locator("[data-test='cancel']").click();
    }

    // step 2 - overview
    public Locator overviewItems() {
        return page.locator("[data-test='inventory-item']");
    }

    public ProductItem overviewItem(String name) {
        for (int i = 0; i < overviewItems().count(); i++) {
            Locator one = overviewItems().nth(i);
            if (one.locator("[data-test='inventory-item-name']").innerText().equals(name)) {
                return new ProductItem(one);
            }
        }
        throw new RuntimeException("item not on overview: " + name);
    }

    public Locator subtotal() {
        return page.locator("[data-test='subtotal-label']");
    }

    public Locator tax() {
        return page.locator("[data-test='tax-label']");
    }

    public Locator total() {
        return page.locator("[data-test='total-label']");
    }

    public Locator paymentInfo() {
        return page.locator("[data-test='payment-info-value']");
    }

    public Locator shippingInfo() {
        return page.locator("[data-test='shipping-info-value']");
    }

    public void finish() {
        page.locator("[data-test='finish']").click();
    }

    // complete
    public Locator completeHeader() {
        return page.locator("[data-test='complete-header']");
    }

    public Locator completeText() {
        return page.locator("[data-test='complete-text']");
    }

    public void backHome() {
        page.locator("[data-test='back-to-products']").click();
    }
}
