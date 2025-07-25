package pl.ceveme.application.dto.language;

import org.junit.jupiter.api.Test;
import pl.ceveme.application.dto.entity.language.LanguageRequest;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class LanguageRequestTest {

    @Test
    void should_createRequest_when_valuesAreCorrect() {
        // given
        String email = "test@wp.pl";
        String name = "English";
        String level = "B2";

        // when
        LanguageRequest request = new LanguageRequest(1L,email, name, level);

        // then
        assertEquals(email, request.email());
        assertEquals(name, request.name());
        assertEquals(level, request.level());
    }

    @Test
    void should_throw_when_languageNameIsEmpty() {
        // given
        String email = "test@wp.pl";
        String name = "";
        String level = "B1";

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> new LanguageRequest(1L,email, name, level));
        assertThat(ex.getMessage()).isEqualTo("Language cannot be null!");
    }

    @Test
    void should_throw_when_languageNameIsNull() {
        // given
        String email = "test@wp.pl";
        String level = "C1";

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> new LanguageRequest(1L,email, null, level));
        assertThat(ex.getMessage()).isEqualTo("Language cannot be null!");
    }

    @Test
    void should_throw_when_levelIsEmpty() {
        // given
        String email = "test@wp.pl";
        String name = "German";
        String level = "";

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> new LanguageRequest(1L,email, name, level));
        assertThat(ex.getMessage()).isEqualTo("Language level must not be blank");
    }

    @Test
    void should_throw_when_levelIsNull() {
        // given
        String email = "test@wp.pl";
        String name = "German";

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> new LanguageRequest(1L,email, name, null));
        assertThat(ex.getMessage()).isEqualTo("Language level must not be blank");
    }

    @Test
    void should_throw_when_levelIsNotAllowed() {
        // given
        String email = "test@wp.pl";
        String name = "Spanish";
        String level = "Z9";

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> new LanguageRequest(1L,email, name, level));
        assertThat(ex.getMessage()).startsWith("Unsupported language level");
    }
}
