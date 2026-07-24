package saucedemo.tests;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import saucedemo.base.BaseTest;
import saucedemo.data.Products;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class ProductDetailsTest extends BaseTest {

    @Test
    @Tag("regression")
    void openingProductShowsDetails() {
        loginAsStandardUser();
        inventoryPage.openProduct(Products.FLEECE);

        assertTrue(page.url().matches(".*/inventory-item\\.html\\?id=\\d+.*"));
        assertEquals(Products.FLEECE, detailsPage.name().innerText());
        assertEquals(Products.FLEECE_PRICE, detailsPage.price().innerText());
        assertFalse(detailsPage.description().innerText().isBlank());
        assertTrue(detailsPage.addButton().isEnabled());
    }

    @Test
    @Tag("regression")
    void backToProductsReturnsToInventory() {
        loginAsStandardUser();
        inventoryPage.openProduct(Products.ONESIE);
        detailsPage.backToProducts();

        assertTrue(page.url().contains("/inventory.html"));
        assertEquals("Products", inventoryPage.header.title().innerText());
        assertTrue(inventoryPage.items().count() > 0);
    }

    @Test
    @Tag("regression")
    void addFromDetailsPageShowsInCart() {
        loginAsStandardUser();
        inventoryPage.openProduct(Products.BOLT_SHIRT);
        detailsPage.addToCart();

        assertEquals("1", detailsPage.header.cartBadge().innerText());
        detailsPage.header.openCart();
        assertEquals(Products.BOLT_SHIRT, cartPage.item(Products.BOLT_SHIRT).name().innerText());
    }
}
