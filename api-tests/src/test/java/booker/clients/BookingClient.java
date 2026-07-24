package booker.clients;

import booker.models.Booking;
import booker.utils.Config;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;

import java.util.Map;

public class BookingClient {

    public BookingClient() {
        RestAssured.baseURI = Config.baseUrl();
    }

    private RequestSpecification base() {
        return RestAssured.given()
                .header("User-Agent", "Mozilla/5.0")
                .header("Connection", "close")
                .contentType("application/json")
                .accept("application/json");
    }

    public Response create(Booking booking) {
        return base().body(booking).when().post("/booking");
    }

    public Response createRaw(String rawJson) {
        return base().body(rawJson).when().post("/booking");
    }

    public Response createPartial(Map<String, Object> partial) {
        return base().body(partial).when().post("/booking");
    }

    public Response getById(int id) {
        return base().when().get("/booking/" + id);
    }

    public Response getIds(Map<String, ?> filters) {
        return base()
                .queryParams(filters == null ? Map.of() : filters)
                .when()
                .get("/booking");
    }

    public Response update(int id, Booking booking, String token) {
        var req = base().body(booking);
        if (token != null) {
            req.header("Cookie", "token=" + token);
        }
        return req.when().put("/booking/" + id);
    }

    public Response partialUpdate(int id, Map<String, Object> partial, String token) {
        var req = base().body(partial);
        if (token != null) {
            req.header("Cookie", "token=" + token);
        }
        return req.when().patch("/booking/" + id);
    }

    public Response delete(int id, String token) {
        var req = base();
        if (token != null) {
            req.header("Cookie", "token=" + token);
        }
        return req.when().delete("/booking/" + id);
    }
}
