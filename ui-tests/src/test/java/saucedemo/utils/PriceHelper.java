package saucedemo.utils;

public class PriceHelper {

    // "$29.99" -> 29.99
    public static double parse(String text) {
        return Double.parseDouble(text.replace("$", "").trim());
    }

    public static String format(double value) {
        return String.format("$%.2f", value);
    }

    // sauce demo uses 8% tax, rounded to 2 decimals
    public static double taxOn(double subtotal) {
        return Math.round(subtotal * 0.08 * 100.0) / 100.0;
    }
}
