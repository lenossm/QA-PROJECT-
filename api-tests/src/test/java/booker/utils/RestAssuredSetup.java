package booker.utils;

import io.restassured.RestAssured;
import io.restassured.config.HttpClientConfig;
import io.restassured.config.RestAssuredConfig;

public class RestAssuredSetup {
    private static boolean done = false;

    public static void init() {
        if (done) {
            return;
        }
        RestAssured.baseURI = Config.baseUrl();
        // without this, apache httpclient sends Expect: 100-continue
        // and restful-booker answers with 418 I'm a Teapot
        RestAssured.config = RestAssuredConfig.config()
                .httpClient(HttpClientConfig.httpClientConfig()
                        .setParam("http.protocol.expect-continue", false));
        done = true;
    }
}
