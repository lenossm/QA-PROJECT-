package booker.models;

public class Booking {
    public String firstname;
    public String lastname;
    public Integer totalprice;
    public Boolean depositpaid;
    public BookingDates bookingdates;
    public String additionalneeds;

    public Booking() {
    }

    public Booking(String firstname, String lastname, Integer totalprice,
                   Boolean depositpaid, BookingDates bookingdates, String additionalneeds) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.totalprice = totalprice;
        this.depositpaid = depositpaid;
        this.bookingdates = bookingdates;
        this.additionalneeds = additionalneeds;
    }
}
