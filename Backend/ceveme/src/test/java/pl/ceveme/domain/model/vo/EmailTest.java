package pl.ceveme.domain.model.vo;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;


class EmailTest {

    @Test
    @DisplayName("Test should create email when credentials are valid")
    void should_createEmail_when_ValueIsValid() {
        //given
        var raw = "test@wp.pl";
        // when
        Email email = new Email(raw);
        // then
        assertThat(email.email()).isEqualTo(raw);
    }

    @Test
    @DisplayName("Test should give information 'Email cannot be null or empty' when credentials are null")
    void should_giveEmailCannotBeNullOrEmpty_when_ValueIsNull() {
        //given
        var raw = "";

        // when + then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new Email(raw));

        assertThat(ex.getMessage()).isEqualTo("Email cannot be null or empty");
    }

    @Test
    @DisplayName("Test should give information 'Invalid email format' when credentials are not Valid")
    void should_giveInvalidEmailFormat_when_ValueIsNull() {
        //given
        var raw = "test@";

        // when + then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new Email(raw));

        assertThat(ex.getMessage()).isEqualTo("Invalid email format");
    }



}