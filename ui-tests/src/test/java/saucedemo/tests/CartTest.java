package saucedemo.tests;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import saucedemo.base.BaseTest;
import saucedemo.data.Products;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class CartTest extends BaseTest {

    @Test
    @Tag("smoke")
    @Tag("regression")
    void addingOneProductUpdatesBadge() {
        loginAsStandardUser();
        inventoryPage.addToCart(Products.BACKPACK);

        assertEquals("1", inventoryPage.header.cartBadge().innerText());
        assertTrue(inventoryPage.item(Products.BACKPACK).removeButton().isVisible());
    }

    @Test
    @Tag("regression")
    void addingSeveralProductsIncrementsBadge() {
        loginAsStandardUser();

        inventoryPage.addToCart(Products.BACKPACK);
        assertEquals("1", inventoryPage.header.cartBadge().innerText());

        inventoryPage.addToCart(Products.BIKE_LIGHT);
        assertEquals("2", inventoryPage.header.cartBadge().innerText());

        inventoryPage.addToCart(Products.ONESIE);
        assertEquals("3", inventoryPage.header.cartBadge().innerText());

        inventoryPage.header.openCart();
        assertEquals(3, cartPage.items().count());
    }

    @Test
    @Tag("regression")
    void removeFromInventoryUpdatesCart() {
        loginAsStandardUser();
        inventoryPage.addToCart(Products.BACKPACK);
        inventoryPage.addToCart(Products.BIKE_LIGHT);
        inventoryPage.removeFromCart(Products.BACKPACK);

        assertEquals("1", inventoryPage.header.cartBadge().innerText());
        inventoryPage.header.openCart();
        assertEquals(1, cartPage.items().count());
        assertEquals(Products.BIKE_LIGHT, cartPage.items().first()
                .locator("[data-test='inventory-item-name']").innerText());
    }

    @Test
    @Tag("regression")
    void removeFromCartPageUpdatesContents() {
        prepareCartWithTwoItems();
        cartPage.removeItem(Products.BACKPACK);

        assertEquals(1, cartPage.items().count());
        assertEquals(Products.BIKE_LIGHT, cartPage.item(Products.BIKE_LIGHT).name().innerText());
        assertEquals("1", cartPage.header.cartBadge().innerText());
    }

    @Test
    @Tag("smoke")
    @Tag("regression")
    void cartShowsCorrectNamePriceAndQty() {
        prepareCartWithTwoItems();

        assertEquals("Your Cart", cartPage.header.title().innerText());
        assertEquals(Products.BACKPACK, cartPage.item(Products.BACKPACK).name().innerText());
        assertEquals(Products.BACKPACK_PRICE, cartPage.item(Products.BACKPACK).price().innerText());
        assertEquals("1", cartPage.quantityOf(Products.BACKPACK));

        assertEquals(Products.BIKE_LIGHT, cartPage.item(Products.BIKE_LIGHT).name().innerText());
        assertEquals(Products.BIKE_LIGHT_PRICE, cartPage.item(Products.BIKE_LIGHT).price().innerText());
        assertEquals("1", cartPage.quantityOf(Products.BIKE_LIGHT));
    }

    @Test
    @Tag("regression")
    void emptyCartHasNoBadge() {
        loginAsStandardUser();
        inventoryPage.header.openCart();

        assertFalse(cartPage.header.cartBadge().isVisible());
        assertEquals("Your Cart", cartPage.header.title().innerText());
        assertEquals(0, cartPage.items().count());
    }

    @Test
    @Tag("regression")
    void continueShoppingKeepsCart() {
        prepareCartWithTwoItems();
        cartPage.continueShopping();

        assertTrue(page.url().contains("/inventory.html"));
        assertEquals("2", inventoryPage.header.cartBadge().innerText());
    }
}
