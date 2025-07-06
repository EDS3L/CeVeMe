package pl.ceveme.domain.model.vo;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class PasswordTest {

    @Test
    @DisplayName("Test should create name when credentials are valid")
    void should_createPassword_when_ValueIsValid() {
        //given
        var raw = "Start1234!";
        // when
        Password password = new Password(raw);
        // then
        assertThat(password.password()).isEqualTo(raw);
    }

    @Test
    @DisplayName("Test should give information 'Password cannot be null or empty' when credentials are null")
    void should_giveInfoThatNameCannotBeNull_when_ValueIsNull() {
        //given
        var raw = "";

        // when + then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new Password(raw));

        assertThat(ex.getMessage()).isEqualTo("Password cannot be null or empty");
    }

    @Test
    @DisplayName("Test should give information 'Password must be at least 8 characters long' when credentials are lower then 3")
    void should_throwsIllegalArgumentException_when_ValueIsLessThen8Characters() {
        //given
        var raw = "Sta12!";

        // when + then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new Password(raw));

        assertThat(ex.getMessage()).isEqualTo("Password must be at least 8 characters long");
    }

    @Test
    @DisplayName("Test should give information 'Password must contain at least one uppercase letter.' when credentials are lower then 3")
    void should_throwsIllegalArgumentException_when_ValueIsLessThenOneUppercaseLetter() {
        //given
        var raw = "start1234!";

        // when + then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new Password(raw));

        assertThat(ex.getMessage()).isEqualTo("Password must contain at least one uppercase letter.");
    }

    @Test
    @DisplayName("Test should give information 'Password must contain at least one lowercase letter.' when credentials are lower then 3")
    void should_throwsIllegalArgumentException_when_ValueIsLessThenOneLowercaseLetter() {
        //given
        var raw = "START1234!";

        // when + then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new Password(raw));

        assertThat(ex.getMessage()).isEqualTo("Password must contain at least one lowercase letter.");
    }

    @Test
    @DisplayName("Test should give information 'Password must contain at least one digit.' when credentials are lower then 3")
    void should_throwsIllegalArgumentException_when_ValueIsLessThenOneUppercaseLetterDigit() {
        //given
        var raw = "Startstart!";

        // when + then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new Password(raw));

        assertThat(ex.getMessage()).isEqualTo("Password must contain at least one digit.");
    }

    @Test
    @DisplayName("Test should give information 'Password must contain at least one special character.' when credentials are lower then 3")
    void should_throwsIllegalArgumentException_when_ValueIsLessThenOneSpecialCharacter() {
        //given
        var raw = "Start12345";

        // when + then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new Password(raw));

        assertThat(ex.getMessage()).isEqualTo("Password must contain at least one special character.");
    }


}