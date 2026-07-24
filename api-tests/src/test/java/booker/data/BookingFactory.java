package booker.data;

import booker.models.Booking;
import booker.models.BookingDates;

import java.time.LocalDate;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.atomic.AtomicInteger;

public class BookingFactory {
    private static final AtomicInteger seq = new AtomicInteger(1);

    public static Booking build() {
        return build(null);
    }

    // pass a booking with only the fields you want to override
    public static Booking build(Booking overrides) {
        LocalDate checkin = LocalDate.now().plusDays(30);
        LocalDate checkout = checkin.plusDays(5);

        Booking b = new Booking();
        b.firstname = "Elene";
        b.lastname = "PortfolioTest-" + System.currentTimeMillis() + "-" + seq.getAndIncrement();
        b.totalprice = ThreadLocalRandom.current().nextInt(100, 1000);
        b.depositpaid = true;
        b.bookingdates = new BookingDates(checkin.toString(), checkout.toString());
        b.additionalneeds = "Breakfast";

        if (overrides != null) {
            if (overrides.firstname != null) b.firstname = overrides.firstname;
            if (overrides.lastname != null) b.lastname = overrides.lastname;
            if (overrides.totalprice != null) b.totalprice = overrides.totalprice;
            if (overrides.depositpaid != null) b.depositpaid = overrides.depositpaid;
            if (overrides.bookingdates != null) b.bookingdates = overrides.bookingdates;
            if (overrides.additionalneeds != null) b.additionalneeds = overrides.additionalneeds;
        }
        return b;
    }
}
