package pl.ceveme.domain.model.vo;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class PhoneNumberTest {

    @Test
    void should_createPhoneNumber_when_ValueIsCorrect() {
        // given
        var phoneNumberValue = "+48696144234";

        //when
        PhoneNumber phoneNumber = new PhoneNumber(phoneNumberValue);

        // then
        assertThat(phoneNumber.phoneNumber()).isEqualTo(phoneNumberValue);
    }

    @Test
    void should_throwsIllegalArgumentException_when_ValueIsNull() {
        // given
        var phoneNumber = "";

        //when + then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,() -> new PhoneNumber(phoneNumber));
        assertThat(ex.getMessage()).isEqualTo("Phone number cannot be null or empty");
    }

    @Test
    void should_throwsIllegalArgumentException_when_ValueIsInvalid() {
        // given
        var phoneNumber = "1231231232";

        //when + then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,() -> new PhoneNumber(phoneNumber));
        assertThat(ex.getMessage()).isEqualTo("Bad phone number format!");
    }
}