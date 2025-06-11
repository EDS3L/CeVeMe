package pl.ceveme.domain.model.vo;

import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;
import jakarta.persistence.Embeddable;

@Embeddable
public record PhoneNumber(String phoneNumber) {

    private static final String DEFAULT_REGION_CODE = "PL";
    private static final PhoneNumberUtil phoneNumberUtil = PhoneNumberUtil.getInstance();

    public PhoneNumber {
        try {
            validate(phoneNumber);
        } catch (NumberParseException e) {
            throw new IllegalArgumentException("Invalid phone number: " + e.getMessage(), e);
        }
    }


    private static void validate(String phoneNumber) throws NumberParseException {
        if (phoneNumber == null || phoneNumber.isEmpty()) {
            throw new IllegalArgumentException("Phone number cannot be null or empty");
        }
        Phonenumber.PhoneNumber parsed = phoneNumberUtil.parse(phoneNumber, DEFAULT_REGION_CODE);
        if (!phoneNumberUtil.isValidNumber(parsed)) {
            throw new IllegalArgumentException("Bad phone number format!");
        }
    }
}
