package booker.clients;

import booker.utils.Config;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;

import java.util.HashMap;
import java.util.Map;

public class AuthClient {

    public AuthClient() {
        RestAssured.baseURI = Config.baseUrl();
    }

    private RequestSpecification base() {
        // Connection close + plain content-type avoids 418 from restful-booker
        return RestAssured.given()
                .header("User-Agent", "Mozilla/5.0")
                .header("Connection", "close")
                .contentType("application/json")
                .accept("application/json");
    }

    public Response createToken(String username, String password) {
        Map<String, String> body = new HashMap<>();
        body.put("username", username);
        body.put("password", password);

        return base()
                .body(body)
                .when()
                .post("/auth");
    }

    public Response createToken() {
        return createToken(Config.username(), Config.password());
    }

    public Response createTokenRaw(String rawBody) {
        return base()
                .body(rawBody)
                .when()
                .post("/auth");
    }
}
