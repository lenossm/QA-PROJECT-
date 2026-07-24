package saucedemo.tests;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import saucedemo.base.BaseTest;
import saucedemo.components.ProductItem;
import saucedemo.data.Products;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class InventoryTest extends BaseTest {

    @Test
    @Tag("smoke")
    @Tag("regression")
    void inventoryShowsAllProducts() {
        loginAsStandardUser();

        assertEquals("Products", inventoryPage.header.title().innerText());
        assertEquals(Products.CATALOGUE_SIZE, inventoryPage.items().count());
    }

    @Test
    @Tag("regression")
    void eachProductCardHasRequiredInfo() {
        loginAsStandardUser();

        for (int i = 0; i < inventoryPage.items().count(); i++) {
            ProductItem card = new ProductItem(inventoryPage.items().nth(i));
            assertFalse(card.name().innerText().isBlank());
            assertFalse(card.description().innerText().isBlank());
            assertTrue(card.price().innerText().matches("^\\$\\d+\\.\\d{2}$"));
            assertTrue(card.addButton().isEnabled());
        }
    }

    @Test
    @Tag("regression")
    void backpackHasExpectedNameAndPrice() {
        loginAsStandardUser();
        ProductItem backpack = inventoryPage.item(Products.BACKPACK);

        assertEquals(Products.BACKPACK, backpack.name().innerText());
        assertEquals(Products.BACKPACK_PRICE, backpack.price().innerText());
    }

    @Test
    @Tag("regression")
    void sortByNameAtoZ() {
        loginAsStandardUser();
        inventoryPage.sortBy("az");

        List<String> actual = inventoryPage.visibleNames();
        List<String> expected = new ArrayList<>(actual);
        expected.sort(String::compareTo);
        assertEquals(expected, actual);
    }

    @Test
    @Tag("regression")
    void sortByNameZtoA() {
        loginAsStandardUser();
        inventoryPage.sortBy("za");

        List<String> actual = inventoryPage.visibleNames();
        List<String> expected = new ArrayList<>(actual);
        expected.sort(Comparator.reverseOrder());
        assertEquals(expected, actual);
    }

    @Test
    @Tag("regression")
    void sortByPriceLowToHigh() {
        loginAsStandardUser();
        inventoryPage.sortBy("lohi");

        List<Double> actual = inventoryPage.visiblePrices();
        List<Double> expected = new ArrayList<>(actual);
        expected.sort(Double::compareTo);
        assertEquals(expected, actual);
    }

    @Test
    @Tag("regression")
    void sortByPriceHighToLow() {
        loginAsStandardUser();
        inventoryPage.sortBy("hilo");

        List<Double> actual = inventoryPage.visiblePrices();
        List<Double> expected = new ArrayList<>(actual);
        expected.sort(Comparator.reverseOrder());
        assertEquals(expected, actual);
    }
}
