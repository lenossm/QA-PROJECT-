package saucedemo.tests;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import saucedemo.base.BaseTest;
import saucedemo.data.CheckoutData;
import saucedemo.data.Products;
import saucedemo.utils.PriceHelper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class PurchaseFlowTest extends BaseTest {

    @Test
    @Tag("e2e")
    @Tag("smoke")
    @Tag("regression")
    void customerCanBuyTwoProducts() {
        // 1. login
        loginAsStandardUser();
        assertEquals("Products", inventoryPage.header.title().innerText());

        // 2. open backpack details, check price, add
        inventoryPage.openProduct(Products.BACKPACK);
        assertEquals(Products.BACKPACK, detailsPage.name().innerText());
        assertEquals(Products.BACKPACK_PRICE, detailsPage.price().innerText());
        detailsPage.addToCart();
        detailsPage.backToProducts();

        // 3. add fleece from the grid
        inventoryPage.addToCart(Products.FLEECE);
        assertEquals("2", inventoryPage.header.cartBadge().innerText());

        // 4. cart check
        inventoryPage.header.openCart();
        assertEquals(2, cartPage.items().count());
        assertEquals(Products.BACKPACK_PRICE, cartPage.item(Products.BACKPACK).price().innerText());
        assertEquals(Products.FLEECE_PRICE, cartPage.item(Products.FLEECE).price().innerText());

        // 5. checkout
        cartPage.startCheckout();
        checkoutPage.fillInfo(CheckoutData.FIRST_NAME, CheckoutData.LAST_NAME, CheckoutData.POSTAL);
        checkoutPage.continueCheckout();
        assertEquals("Checkout: Overview", checkoutPage.header.title().innerText());

        // 6. totals: 29.99 + 49.99 = 79.98 + 8% tax
        double subtotal = 29.99 + 49.99;
        double tax = PriceHelper.taxOn(subtotal);
        assertEquals("Item total: " + PriceHelper.format(subtotal), checkoutPage.subtotal().innerText());
        assertEquals("Tax: " + PriceHelper.format(tax), checkoutPage.tax().innerText());
        assertEquals("Total: " + PriceHelper.format(subtotal + tax), checkoutPage.total().innerText());

        // 7. finish
        checkoutPage.finish();
        assertEquals("Thank you for your order!", checkoutPage.completeHeader().innerText());
        assertFalse(checkoutPage.header.cartBadge().isVisible());
    }
}
