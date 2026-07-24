package booker.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class Config {
    private static final Properties props = new Properties();

    static {
        try (InputStream in = Config.class.getClassLoader().getResourceAsStream("config.properties")) {
            if (in == null) {
                throw new RuntimeException("config.properties missing");
            }
            props.load(in);
        } catch (IOException e) {
            throw new RuntimeException("failed to load config", e);
        }
    }

    public static String get(String key) {
        return props.getProperty(key);
    }

    // optional overrides - don't use plain USERNAME (windows sets that)
    public static String baseUrl() {
        String env = System.getenv("API_BASE_URL");
        return env != null && !env.isBlank() ? env : get("baseUrl");
    }

    public static String username() {
        String env = System.getenv("API_USERNAME");
        return env != null && !env.isBlank() ? env : get("username");
    }

    public static String password() {
        String env = System.getenv("API_PASSWORD");
        return env != null && !env.isBlank() ? env : get("password");
    }

    public static int responseTimeBudgetMs() {
        String env = System.getenv("RESPONSE_TIME_BUDGET_MS");
        if (env != null && !env.isBlank()) {
            return Integer.parseInt(env);
        }
        return Integer.parseInt(get("responseTimeBudgetMs"));
    }
}
