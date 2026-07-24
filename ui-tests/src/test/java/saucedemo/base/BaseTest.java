package saucedemo.base;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import saucedemo.data.Products;
import saucedemo.data.Users;
import saucedemo.pages.CartPage;
import saucedemo.pages.CheckoutPage;
import saucedemo.pages.InventoryPage;
import saucedemo.pages.LoginPage;
import saucedemo.pages.ProductDetailsPage;
import saucedemo.utils.Config;

public abstract class BaseTest {
    protected Playwright playwright;
    protected Browser browser;
    protected BrowserContext context;
    protected Page page;

    protected LoginPage loginPage;
    protected InventoryPage inventoryPage;
    protected ProductDetailsPage detailsPage;
    protected CartPage cartPage;
    protected CheckoutPage checkoutPage;

    @BeforeEach
    void setUp() {
        playwright = Playwright.create();
        browser = playwright.chromium().launch(
                new BrowserType.LaunchOptions().setHeadless(Config.headless()));
        context = browser.newContext(new Browser.NewContextOptions()
                .setBaseURL(Config.baseUrl()));
        page = context.newPage();

        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        detailsPage = new ProductDetailsPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
    }

    @AfterEach
    void tearDown() {
        if (context != null) {
            context.close();
        }
        if (browser != null) {
            browser.close();
        }
        if (playwright != null) {
            playwright.close();
        }
    }

    protected void loginAsStandardUser() {
        loginPage.open();
        loginPage.login(Users.STANDARD, Users.PASSWORD);
    }

    // login + add backpack and bike light, land on cart
    protected void prepareCartWithTwoItems() {
        loginAsStandardUser();
        inventoryPage.addToCart(Products.BACKPACK);
        inventoryPage.addToCart(Products.BIKE_LIGHT);
        inventoryPage.header.openCart();
    }
}
