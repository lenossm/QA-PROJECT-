package saucedemo.components;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.options.AriaRole;
import saucedemo.utils.PriceHelper;

public class ProductItem {
    private final Locator root;

    public ProductItem(Locator root) {
        this.root = root;
    }

    public Locator name() {
        return root.locator("[data-test='inventory-item-name']");
    }

    public Locator description() {
        return root.locator("[data-test='inventory-item-desc']");
    }

    public Locator price() {
        return root.locator("[data-test='inventory-item-price']");
    }

    public double priceValue() {
        return PriceHelper.parse(price().innerText());
    }

    public Locator addButton() {
        return root.getByRole(AriaRole.BUTTON, new Locator.GetByRoleOptions().setName("Add to cart"));
    }

    public Locator removeButton() {
        return root.getByRole(AriaRole.BUTTON, new Locator.GetByRoleOptions().setName("Remove"));
    }

    public void addToCart() {
        addButton().click();
    }

    public void removeFromCart() {
        removeButton().click();
    }
}
