package booker.tests;

import booker.base.ApiBase;
import booker.utils.Config;
import io.restassured.module.jsv.JsonSchemaValidator;
import io.restassured.response.Response;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class AuthTest extends ApiBase {

    @Test
    @Tag("smoke")
    void createsTokenWithValidCredentials() {
        Response res = authClient.createToken();

        assertEquals(200, res.statusCode());
        assertTrue(res.getContentType().contains("application/json"));
        res.then().body(JsonSchemaValidator.matchesJsonSchemaInClasspath("schemas/auth-token-schema.json"));
        assertTrue(res.jsonPath().getString("token").length() > 0);
    }

    @Test
    @Tag("negative")
    void invalidUsernameReturnsBadCredentials() {
        // DEF-API-001: api returns 200 instead of 401
        Response res = authClient.createToken("not_a_real_user", Config.password());

        assertEquals(200, res.statusCode());
        assertEquals("Bad credentials", res.jsonPath().getString("reason"));
        assertNull(res.jsonPath().get("token"));
    }

    @Test
    @Tag("negative")
    void invalidPasswordReturnsBadCredentials() {
        Response res = authClient.createToken(Config.username(), "wrong_password");

        assertEquals(200, res.statusCode());
        assertEquals("Bad credentials", res.jsonPath().getString("reason"));
        assertNull(res.jsonPath().get("token"));
    }

    @Test
    @Tag("negative")
    void missingCredentialsReturnsBadCredentials() {
        Response res = authClient.createTokenRaw("{}");

        assertEquals(200, res.statusCode());
        assertEquals("Bad credentials", res.jsonPath().getString("reason"));
        assertNull(res.jsonPath().get("token"));
    }

    @Test
    @Tag("negative")
    void malformedJsonIsRejected() {
        Response res = authClient.createTokenRaw("{not valid json");
        assertEquals(400, res.statusCode());
    }
}
