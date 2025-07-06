package pl.ceveme.domain.model.vo;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class NameTest {


    @Test
    @DisplayName("Test should create name when credentials are valid")
    void should_createEmail_when_ValueIsValid() {
        //given
        var raw = "Mark";
        // when
        Name name = new Name(raw);
        // then
        assertThat(name.name()).isEqualTo(raw);
    }

    @Test
    @DisplayName("Test should give information 'Name cannot be null or empty' when credentials are null")
    void should_giveInfoThatNameCannotBeNull_when_ValueIsNull() {
        //given
        var raw = "";

        // when + then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new Name(raw));

        assertThat(ex.getMessage()).isEqualTo("Name cannot be null or empty");
    }

    @Test
    @DisplayName("Test should give information 'Name must be at least 2 characters long' when credentials are lower then 3")
    void should_giveInfoThatNameMustHaveMoreThen2Characters_when_ValueIsLessThen3Letters() {
        //given
        var raw = "MA";

        // when + then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new Name(raw));

        assertThat(ex.getMessage()).isEqualTo("Name must be at least 2 characters long");
    }

    @Test
    @DisplayName("Test should give information 'Name must be at least 2 characters long' when credentials are lower then 3")
    void should_giveInfoThatNameCanOnlyHaveLetters_when_ValueHasDigitsOrSpecialCharacters() {
        //given
        var raw = "MA!!!";

        // when + then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new Name(raw));

        assertThat(ex.getMessage()).isEqualTo("Name must contain only letters (no digits or special characters).");
    }

}