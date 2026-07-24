package booker.tests;

import booker.base.ApiBase;
import booker.data.BookingFactory;
import booker.models.Booking;
import io.restassured.response.Response;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

public class BookingNegativeTest extends ApiBase {

    @Test
    @Tag("negative")
    void retrievingNonexistentReturns404() {
        Response res = bookingClient.getById(99999999);
        assertEquals(404, res.statusCode());
    }

    @Test
    @Tag("negative")
    void updatingNonexistentReturns405() {
        // DEF-API-003
        getToken();
        Booking payload = BookingFactory.build();
        Response res = bookingClient.update(99999999, payload, token);
        assertEquals(405, res.statusCode());
    }

    @Test
    @Tag("negative")
    void deletingNonexistentReturns405() {
        getToken();
        Response res = bookingClient.delete(99999999, token);
        assertEquals(405, res.statusCode());
    }

    @Test
    @Tag("negative")
    void updateWithoutAuthReturns403() {
        getToken();
        Booking original = createBooking();

        Booking changed = BookingFactory.build();
        changed.firstname = "Hacker";
        Response res = bookingClient.update(bookingIdToClean, changed, null);
        assertEquals(403, res.statusCode());

        Response get = bookingClient.getById(bookingIdToClean);
        assertEquals(original.firstname, get.jsonPath().getString("firstname"));
    }

    @Test
    @Tag("negative")
    void deleteWithoutAuthReturns403() {
        getToken();
        createBooking();

        Response res = bookingClient.delete(bookingIdToClean, null);
        assertEquals(403, res.statusCode());

        Response get = bookingClient.getById(bookingIdToClean);
        assertEquals(200, get.statusCode());
    }

    @Test
    @Tag("negative")
    void updateWithInvalidTokenReturns403() {
        getToken();
        createBooking();

        Booking changed = BookingFactory.build();
        Response res = bookingClient.update(bookingIdToClean, changed, "invalid-token-123");
        assertEquals(403, res.statusCode());
    }

    @Test
    @Tag("negative")
    void missingMandatoryFieldsReturns500() {
        // DEF-API-004
        Map<String, Object> partial = new HashMap<>();
        partial.put("firstname", "OnlyFirstName");

        Response res = bookingClient.createPartial(partial);
        assertEquals(500, res.statusCode());
    }

    @Test
    @Tag("negative")
    void wronglyTypedPriceStoredAsNull() {
        // DEF-API-005
        String raw = """
                {
                  "firstname": "TypeBug",
                  "lastname": "PriceNull",
                  "totalprice": "not-a-number",
                  "depositpaid": true,
                  "bookingdates": { "checkin": "2026-08-01", "checkout": "2026-08-05" },
                  "additionalneeds": "None"
                }
                """;
        Response res = bookingClient.createRaw(raw);
        assertEquals(200, res.statusCode());
        assertNull(res.jsonPath().get("booking.totalprice"));

        bookingIdToClean = res.jsonPath().getInt("bookingid");
        getToken();
    }

    @Test
    @Tag("negative")
    void invalidCheckinDateStoredWeirdly() {
        // DEF-API-006
        String raw = """
                {
                  "firstname": "DateBug",
                  "lastname": "BadCheckin",
                  "totalprice": 120,
                  "depositpaid": true,
                  "bookingdates": { "checkin": "not-a-date", "checkout": "2026-08-05" },
                  "additionalneeds": "None"
                }
                """;
        Response res = bookingClient.createRaw(raw);
        assertEquals(200, res.statusCode());
        assertEquals("0NaN-aN-aN", res.jsonPath().getString("booking.bookingdates.checkin"));

        bookingIdToClean = res.jsonPath().getInt("bookingid");
        getToken();
    }

    @Test
    @Tag("negative")
    void malformedJsonReturns400() {
        Response res = bookingClient.createRaw("{broken");
        assertEquals(400, res.statusCode());
    }

    @Test
    @Tag("negative")
    void emptyBodyReturns500() {
        // used to be 400, now the api returns 500 on empty body
        Response res = bookingClient.createRaw("");
        assertEquals(500, res.statusCode());
    }
}
