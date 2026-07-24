package booker.tests;

import booker.base.ApiBase;
import booker.data.BookingFactory;
import booker.models.Booking;
import io.restassured.response.Response;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class BookingCrudTest extends ApiBase {

    @Test
    @Tag("smoke")
    void createsBookingAndReturnsStoredData() {
        Booking payload = BookingFactory.build();
        Response res = bookingClient.create(payload);

        assertEquals(200, res.statusCode());
        int id = res.jsonPath().getInt("bookingid");
        assertTrue(id > 0);
        assertEquals(payload.firstname, res.jsonPath().getString("booking.firstname"));
        assertEquals(payload.lastname, res.jsonPath().getString("booking.lastname"));
        assertEquals(payload.totalprice, res.jsonPath().getInt("booking.totalprice"));

        bookingIdToClean = id;
        getToken();
    }

    @Test
    @Tag("smoke")
    void retrievesBookingById() {
        getToken();
        Booking payload = createBooking();

        Response res = bookingClient.getById(bookingIdToClean);
        assertEquals(200, res.statusCode());
        assertEquals(payload.firstname, res.jsonPath().getString("firstname"));
        assertEquals(payload.lastname, res.jsonPath().getString("lastname"));
        assertEquals(payload.totalprice, res.jsonPath().getInt("totalprice"));
        assertEquals(payload.depositpaid, res.jsonPath().getBoolean("depositpaid"));
        assertEquals(payload.bookingdates.checkin, res.jsonPath().getString("bookingdates.checkin"));
        assertEquals(payload.bookingdates.checkout, res.jsonPath().getString("bookingdates.checkout"));
        assertEquals(payload.additionalneeds, res.jsonPath().getString("additionalneeds"));
    }

    @Test
    @Tag("regression")
    void listFilterIncludesCreatedBooking() {
        getToken();
        Booking payload = createBooking();

        Map<String, String> filter = new HashMap<>();
        filter.put("lastname", payload.lastname);
        Response res = bookingClient.getIds(filter);

        assertEquals(200, res.statusCode());
        List<Integer> ids = res.jsonPath().getList("bookingid");
        assertTrue(ids.contains(bookingIdToClean));
    }

    @Test
    @Tag("regression")
    void fullUpdateReplacesAllFields() {
        getToken();
        createBooking();

        Booking replacement = BookingFactory.build();
        replacement.firstname = "Updated";
        replacement.totalprice = 250;
        replacement.additionalneeds = "Late checkout";

        Response putRes = bookingClient.update(bookingIdToClean, replacement, token);
        assertEquals(200, putRes.statusCode());
        assertEquals("Updated", putRes.jsonPath().getString("firstname"));
        assertEquals(250, putRes.jsonPath().getInt("totalprice"));

        Response getRes = bookingClient.getById(bookingIdToClean);
        assertEquals("Updated", getRes.jsonPath().getString("firstname"));
        assertEquals(250, getRes.jsonPath().getInt("totalprice"));
        assertEquals("Late checkout", getRes.jsonPath().getString("additionalneeds"));
    }

    @Test
    @Tag("regression")
    void partialUpdateChangesOnlyProvidedFields() {
        getToken();
        Booking original = createBooking();

        Map<String, Object> patch = new HashMap<>();
        patch.put("firstname", "Patched");
        patch.put("totalprice", 555);

        Response res = bookingClient.partialUpdate(bookingIdToClean, patch, token);
        assertEquals(200, res.statusCode());
        assertEquals("Patched", res.jsonPath().getString("firstname"));
        assertEquals(555, res.jsonPath().getInt("totalprice"));
        // lastname should stay the same
        assertEquals(original.lastname, res.jsonPath().getString("lastname"));
    }

    @Test
    @Tag("smoke")
    void deletedBookingIsNoLongerAccessible() {
        getToken();
        createBooking();

        // DEF-API-002: delete returns 201 not 204
        Response del = bookingClient.delete(bookingIdToClean, token);
        assertEquals(201, del.statusCode());

        Response get = bookingClient.getById(bookingIdToClean);
        assertEquals(404, get.statusCode());
        bookingIdToClean = null; // already gone
    }
}
