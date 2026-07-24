package saucedemo.tests;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import saucedemo.base.BaseTest;
import saucedemo.data.CheckoutData;
import saucedemo.data.Products;
import saucedemo.utils.PriceHelper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class CheckoutTest extends BaseTest {

    @BeforeEach
    void goToCheckout() {
        prepareCartWithTwoItems();
        cartPage.startCheckout();
    }

    @Test
    @Tag("smoke")
    @Tag("regression")
    void completeCheckoutWithValidData() {
        checkoutPage.fillInfo(CheckoutData.FIRST_NAME, CheckoutData.LAST_NAME, CheckoutData.POSTAL);
        checkoutPage.continueCheckout();
        assertTrue(page.url().contains("checkout-step-two"));

        checkoutPage.finish();
        assertTrue(page.url().contains("checkout-complete"));
        assertEquals("Thank you for your order!", checkoutPage.completeHeader().innerText());
        assertTrue(checkoutPage.completeText().innerText().contains("Your order has been dispatched"));
        assertFalse(checkoutPage.header.cartBadge().isVisible());
    }

    @Test
    @Tag("negative")
    @Tag("regression")
    void missingFirstNameBlocksCheckout() {
        checkoutPage.fillInfo("", CheckoutData.LAST_NAME, CheckoutData.POSTAL);
        checkoutPage.continueCheckout();

        assertEquals(CheckoutData.ERR_FIRST, checkoutPage.error().innerText());
        assertTrue(page.url().contains("checkout-step-one"));
    }

    @Test
    @Tag("negative")
    @Tag("regression")
    void missingLastNameBlocksCheckout() {
        checkoutPage.fillInfo(CheckoutData.FIRST_NAME, "", CheckoutData.POSTAL);
        checkoutPage.continueCheckout();

        assertEquals(CheckoutData.ERR_LAST, checkoutPage.error().innerText());
        assertTrue(page.url().contains("checkout-step-one"));
    }

    @Test
    @Tag("negative")
    @Tag("regression")
    void missingPostalBlocksCheckout() {
        checkoutPage.fillInfo(CheckoutData.FIRST_NAME, CheckoutData.LAST_NAME, "");
        checkoutPage.continueCheckout();

        assertEquals(CheckoutData.ERR_POSTAL, checkoutPage.error().innerText());
        assertTrue(page.url().contains("checkout-step-one"));
    }

    @Test
    @Tag("regression")
    void overviewShowsProductsAndPaymentInfo() {
        checkoutPage.fillInfo(CheckoutData.FIRST_NAME, CheckoutData.LAST_NAME, CheckoutData.POSTAL);
        checkoutPage.continueCheckout();

        assertEquals("Checkout: Overview", checkoutPage.header.title().innerText());
        assertEquals(Products.BACKPACK, checkoutPage.overviewItem(Products.BACKPACK).name().innerText());
        assertEquals(Products.BIKE_LIGHT, checkoutPage.overviewItem(Products.BIKE_LIGHT).name().innerText());
        assertTrue(checkoutPage.paymentInfo().innerText().contains("SauceCard"));
        assertFalse(checkoutPage.shippingInfo().innerText().isBlank());
    }

    @Test
    @Tag("regression")
    void overviewTotalsMatchItemSumPlusTax() {
        checkoutPage.fillInfo(CheckoutData.FIRST_NAME, CheckoutData.LAST_NAME, CheckoutData.POSTAL);
        checkoutPage.continueCheckout();

        double subtotal = PriceHelper.parse(Products.BACKPACK_PRICE)
                + PriceHelper.parse(Products.BIKE_LIGHT_PRICE);
        double tax = PriceHelper.taxOn(subtotal);
        double total = subtotal + tax;

        assertEquals("Item total: " + PriceHelper.format(subtotal), checkoutPage.subtotal().innerText());
        assertEquals("Tax: " + PriceHelper.format(tax), checkoutPage.tax().innerText());
        assertEquals("Total: " + PriceHelper.format(total), checkoutPage.total().innerText());
    }

    @Test
    @Tag("regression")
    void cancelKeepsCartIntact() {
        checkoutPage.cancel();

        assertTrue(page.url().contains("/cart.html"));
        assertEquals("2", cartPage.header.cartBadge().innerText());
        assertEquals(2, cartPage.items().count());
    }

    @Test
    @Tag("regression")
    void backHomeAfterOrderShowsCleanInventory() {
        checkoutPage.fillInfo(CheckoutData.FIRST_NAME, CheckoutData.LAST_NAME, CheckoutData.POSTAL);
        checkoutPage.continueCheckout();
        checkoutPage.finish();
        checkoutPage.backHome();

        assertTrue(page.url().contains("/inventory.html"));
        assertFalse(inventoryPage.header.cartBadge().isVisible());
    }
}
