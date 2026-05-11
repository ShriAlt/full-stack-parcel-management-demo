package com.tcs.parcelX.util;
import java.util.regex.Pattern;
import java.time.YearMonth;

public class ValidationUtil {
    private static final String USERNAME_PATTERN = "^[a-zA-Z0-9_]{3,20}$";
    private static final String PASSWORD_PATTERN = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$";
    private static final String NAME_PATTERN = "^[A-Za-z][A-Za-z ]{1,49}$";
    private static final String EMAIL_PATTERN = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
    private static final String PHONE_PATTERN = "^[6-9][0-9]{9}$";
    private static final String ZIP_CODE_PATTERN = "^[1-9][0-9]{5}$";
    private static final String UPI_PATTERN = "^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$";
    private static final String CARD_NUMBER_PATTERN = "^[0-9]{16}$";
    private static final String CVV_PATTERN = "^[1-9][0-9]{2}$";
    private static final String EXPIRY_PATTERN = "^(0[1-9]|1[0-2])/\\d{2}$";

    public static boolean isValidUsername(String username) {
        return username != null && Pattern.matches(USERNAME_PATTERN, username);
    }

    public static boolean isValidPassword(String password) {
        return password != null && Pattern.matches(PASSWORD_PATTERN, password);
    }

    public static boolean isValidName(String name) {
        return name != null && Pattern.matches(NAME_PATTERN, name.trim().replaceAll("\\s+", " "));
    }

    public static boolean isValidEmail(String email) {
        return email != null && Pattern.matches(EMAIL_PATTERN, email);
    }

    public static boolean isValidPhone(String phone) {
        return phone != null && Pattern.matches(PHONE_PATTERN, phone);
    }

    public static boolean isValidAddress(String address) {
        return address != null && address.trim().length() >= 10 && address.trim().length() <= 120;
    }

    public static boolean isValidZipCode(String zipCode) {
        return zipCode != null && Pattern.matches(ZIP_CODE_PATTERN, zipCode);
    }

    public static boolean isValidUPI(String upi) {
        return upi != null && Pattern.matches(UPI_PATTERN, upi);
    }

    public static boolean isValidCardNumber(String cardNumber) {
        if (cardNumber == null) {
            return false;
        }
        String normalizedCardNumber = cardNumber.replaceAll("\\D", "");
        return Pattern.matches(CARD_NUMBER_PATTERN, normalizedCardNumber) && luhnCheck(normalizedCardNumber);
    }

    public static boolean isValidCVV(String cvv) {
        return cvv != null && Pattern.matches(CVV_PATTERN, cvv);
    }

    public static boolean isValidExpiryDate(String expiryDate) {
        if (expiryDate == null || !Pattern.matches(EXPIRY_PATTERN, expiryDate)) {
            return false;
        }

        String[] parts = expiryDate.split("/");
        int month = Integer.parseInt(parts[0]);
        int year = 2000 + Integer.parseInt(parts[1]);
        return YearMonth.of(year, month).isAfter(YearMonth.now());
    }

    private static boolean luhnCheck(String cardNumber) {
        int sum = 0;
        boolean isEven = false;
        for (int i = cardNumber.length() - 1; i >= 0; i--) {
            int digit = Character.getNumericValue(cardNumber.charAt(i));
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            sum += digit;
            isEven = !isEven;
        }
        return (sum % 10) == 0;
    }
}

