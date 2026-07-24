package saucedemo.pages;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import saucedemo.components.Header;
import saucedemo.components.ProductItem;

import java.util.ArrayList;
import java.util.List;

public class InventoryPage {
    private final Page page;
    public final Header header;

    public InventoryPage(Page page) {
        this.page = page;
        this.header = new Header(page);
    }

    public void open() {
        page.navigate("/inventory.html");
    }

    public Locator list() {
        return page.locator("[data-test='inventory-list']");
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
        throw new RuntimeException("product not found: " + name);
    }

    public void addToCart(String name) {
        item(name).addToCart();
    }

    public void removeFromCart(String name) {
        item(name).removeFromCart();
    }

    public void openProduct(String name) {
        item(name).name().click();
    }

    public void sortBy(String value) {
        // values: az, za, lohi, hilo
        page.locator("[data-test='product-sort-container']").selectOption(value);
    }

    public List<String> visibleNames() {
        List<String> names = new ArrayList<>();
        Locator nameLoc = page.locator("[data-test='inventory-item-name']");
        for (int i = 0; i < nameLoc.count(); i++) {
            names.add(nameLoc.nth(i).innerText());
        }
        return names;
    }

    public List<Double> visiblePrices() {
        List<Double> prices = new ArrayList<>();
        Locator priceLoc = page.locator("[data-test='inventory-item-price']");
        for (int i = 0; i < priceLoc.count(); i++) {
            prices.add(saucedemo.utils.PriceHelper.parse(priceLoc.nth(i).innerText()));
        }
        return prices;
    }
}
