package saucedemo.data;

public class Users {
    public static final String STANDARD = saucedemo.utils.Config.standardUser();
    public static final String LOCKED_OUT = saucedemo.utils.Config.lockedOutUser();
    public static final String PASSWORD = saucedemo.utils.Config.password();

    public static final String ERR_WRONG =
            "Epic sadface: Username and password do not match any user in this service";
    public static final String ERR_USER_REQUIRED = "Epic sadface: Username is required";
    public static final String ERR_PASS_REQUIRED = "Epic sadface: Password is required";
    public static final String ERR_LOCKED = "Epic sadface: Sorry, this user has been locked out.";
}
