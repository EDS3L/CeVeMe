package pl.ceveme.domain.model.vo;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class SurnameTest {

    @Test
    void should_createSurname_when_ValueIsCorrect() {
        // given
        var value = "Kowalski";

        // when
        Surname surname = new Surname(value);

        // then
        assertThat(surname.surname()).isEqualTo(value);
    }

    @Test
    void should_throwIllegalArgumentException_when_ValueIsNull() {
        // given
        var value = "";

        // when + then
        final IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new Surname(value));
        assertThat(ex.getMessage()).isEqualTo("Surname cannot be null or empty");
    }

    @Test
    void should_throwIllegalArgumentException_when_ValueIsLowerThen2Characters() {
        // given
        var value = "";

        // when + then
        final IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new Surname(value));
        assertThat(ex.getMessage()).isEqualTo("Surname cannot be null or empty");
    }


    @Test
    void should_throwIllegalArgumentException_when_ValueIsNotOnlyLetters() {
        // given
        var value = "Kowalski1";

        // when + then
        final IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new Surname(value));
        assertThat(ex.getMessage()).isEqualTo("Surname must contain only letters (including accented letters).");
    }
}