package saucedemo.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class Config {
    private static final Properties props = new Properties();

    static {
        try (InputStream in = Config.class.getClassLoader().getResourceAsStream("config.properties")) {
            if (in == null) {
                throw new RuntimeException("config.properties not found");
            }
            props.load(in);
        } catch (IOException e) {
            throw new RuntimeException("could not load config", e);
        }
    }

    public static String get(String key) {
        return props.getProperty(key);
    }

    public static String baseUrl() {
        String env = System.getenv("BASE_URL");
        return env != null && !env.isBlank() ? env : get("baseUrl");
    }

    public static String standardUser() {
        String env = System.getenv("STANDARD_USER");
        return env != null && !env.isBlank() ? env : get("standardUser");
    }

    public static String lockedOutUser() {
        String env = System.getenv("LOCKED_OUT_USER");
        return env != null && !env.isBlank() ? env : get("lockedOutUser");
    }

    public static String password() {
        // don't read plain PASSWORD - windows / shells often set that
        String env = System.getenv("SAUCE_PASSWORD");
        return env != null && !env.isBlank() ? env : get("password");
    }

    public static boolean headless() {
        String env = System.getenv("HEADLESS");
        if (env != null && !env.isBlank()) {
            return Boolean.parseBoolean(env);
        }
        return Boolean.parseBoolean(get("headless"));
    }
}
