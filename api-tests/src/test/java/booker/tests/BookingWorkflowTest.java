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

public class BookingWorkflowTest extends ApiBase {

    @Test
    @Tag("e2e")
    @Tag("smoke")
    void fullBookingLifecycle() {
        // token
        String tok = getToken();

        // create
        Booking payload = BookingFactory.build();
        Response create = bookingClient.create(payload);
        assertEquals(200, create.statusCode());
        int id = create.jsonPath().getInt("bookingid");

        // read
        Response get1 = bookingClient.getById(id);
        assertEquals(200, get1.statusCode());
        assertEquals(payload.lastname, get1.jsonPath().getString("lastname"));

        // full update
        Booking updated = BookingFactory.build();
        updated.firstname = "Lifecycle";
        updated.totalprice = 777;
        Response put = bookingClient.update(id, updated, tok);
        assertEquals(200, put.statusCode());
        assertEquals("Lifecycle", put.jsonPath().getString("firstname"));
        assertEquals(777, put.jsonPath().getInt("totalprice"));

        // patch
        Map<String, Object> patch = new HashMap<>();
        patch.put("additionalneeds", "Airport transfer");
        Response patchRes = bookingClient.partialUpdate(id, patch, tok);
        assertEquals(200, patchRes.statusCode());
        assertEquals("Airport transfer", patchRes.jsonPath().getString("additionalneeds"));

        // delete (api returns 201 - known quirk)
        Response del = bookingClient.delete(id, tok);
        assertEquals(201, del.statusCode());

        // verify gone
        Response get2 = bookingClient.getById(id);
        assertEquals(404, get2.statusCode());
    }
}
