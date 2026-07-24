package booker.base;

import booker.clients.AuthClient;
import booker.clients.BookingClient;
import booker.data.BookingFactory;
import booker.models.Booking;
import booker.utils.RestAssuredSetup;
import io.restassured.response.Response;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;

public abstract class ApiBase {
    protected AuthClient authClient;
    protected BookingClient bookingClient;
    protected String token;
    protected Integer bookingIdToClean;

    @BeforeEach
    void setUpClients() throws InterruptedException {
        RestAssuredSetup.init();
        authClient = new AuthClient();
        bookingClient = new BookingClient();
        bookingIdToClean = null;
        // tiny pause so we don't get rate limited on the shared app
        Thread.sleep(300);
    }

    @AfterEach
    void cleanupBooking() {
        if (bookingIdToClean != null && token != null) {
            try {
                bookingClient.delete(bookingIdToClean, token);
            } catch (Exception ignored) {
                // already deleted or api hiccup
            }
        }
    }

    protected String getToken() {
        Response res = authClient.createToken();
        token = res.jsonPath().getString("token");
        return token;
    }

    protected Booking createBooking() {
        Booking payload = BookingFactory.build();
        Response res = bookingClient.create(payload);
        bookingIdToClean = res.jsonPath().getInt("bookingid");
        return payload;
    }
}
