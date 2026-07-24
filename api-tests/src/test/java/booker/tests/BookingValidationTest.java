package booker.tests;

import booker.base.ApiBase;
import booker.data.BookingFactory;
import booker.models.Booking;
import booker.utils.Config;
import io.restassured.module.jsv.JsonSchemaValidator;
import io.restassured.response.Response;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class BookingValidationTest extends ApiBase {

    @Test
    @Tag("regression")
    void createResponseMatchesSchema() {
        Booking payload = BookingFactory.build();
        Response res = bookingClient.create(payload);

        assertEquals(200, res.statusCode());
        res.then().body(JsonSchemaValidator.matchesJsonSchemaInClasspath("schemas/created-booking-schema.json"));
        bookingIdToClean = res.jsonPath().getInt("bookingid");
        getToken();
    }

    @Test
    @Tag("regression")
    void getBookingMatchesSchema() {
        getToken();
        createBooking();

        Response res = bookingClient.getById(bookingIdToClean);
        assertEquals(200, res.statusCode());
        res.then().body(JsonSchemaValidator.matchesJsonSchemaInClasspath("schemas/booking-schema.json"));
    }

    @Test
    @Tag("regression")
    void bookingIdListMatchesSchema() {
        Response res = bookingClient.getIds(null);
        assertEquals(200, res.statusCode());
        res.then().body(JsonSchemaValidator.matchesJsonSchemaInClasspath("schemas/booking-id-list-schema.json"));
        assertTrue(res.jsonPath().getList("$").size() > 0);
    }

    @Test
    @Tag("regression")
    void readEndpointsSendJsonContentType() {
        getToken();
        createBooking();

        Response getOne = bookingClient.getById(bookingIdToClean);
        String ct = getOne.getContentType().toLowerCase();
        assertTrue(ct.contains("application/json"));
        assertTrue(ct.contains("charset=utf-8"));
    }

    @Test
    @Tag("regression")
    void getBookingRespondsWithinBudget() {
        getToken();
        createBooking();

        long start = System.currentTimeMillis();
        Response res = bookingClient.getById(bookingIdToClean);
        long elapsed = System.currentTimeMillis() - start;

        assertEquals(200, res.statusCode());
        assertTrue(elapsed < Config.responseTimeBudgetMs(),
                "took " + elapsed + "ms, budget is " + Config.responseTimeBudgetMs());
    }

    @Test
    @Tag("regression")
    void createAndUpdateValuesStayConsistent() {
        getToken();
        Booking original = createBooking();

        Response get1 = bookingClient.getById(bookingIdToClean);
        assertEquals(original.firstname, get1.jsonPath().getString("firstname"));
        assertEquals(original.totalprice, get1.jsonPath().getInt("totalprice"));

        Booking updated = BookingFactory.build();
        updated.firstname = "Consistent";
        updated.totalprice = 321;
        bookingClient.update(bookingIdToClean, updated, token);

        Response get2 = bookingClient.getById(bookingIdToClean);
        assertEquals("Consistent", get2.jsonPath().getString("firstname"));
        assertEquals(321, get2.jsonPath().getInt("totalprice"));
    }
}
