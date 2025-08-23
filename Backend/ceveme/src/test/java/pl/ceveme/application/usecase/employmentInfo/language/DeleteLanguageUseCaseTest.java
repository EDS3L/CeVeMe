package pl.ceveme.application.usecase.employmentInfo.language;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
import pl.ceveme.application.dto.entity.language.LanguageResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Language;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DeleteLanguageUseCaseTest {

    @Mock
    private EmploymentInfoRepository employmentInfoRepository;

    @InjectMocks
    private DeleteLanguageUseCase deleteLanguageUseCase;

    @Test
    void should_deleteLanguage_when_exists() {
        // given
        Long languageId = 123L;
        Long infoId = 1L;
        Language language = createLanguageWithId(languageId, "To delete", "Level");

        EmploymentInfo info = new EmploymentInfo();
        info.addLanguage(language);

        when(employmentInfoRepository.findById(infoId)).thenReturn(Optional.of(info));

        // when
        LanguageResponse response = deleteLanguageUseCase.execute(new DeleteEntityRequest(languageId, infoId));

        // then
        assertThat(response.name()).isEqualTo("To delete");
        assertThat(response.message()).isEqualTo("Language deleted successfully");
    }

    @Test
    void should_throwException_when_languageNotFound() {
        // given
        Long languageId = 999L;
        Long infoId = 1L;
        EmploymentInfo info = new EmploymentInfo();

        when(employmentInfoRepository.findById(infoId)).thenReturn(Optional.of(info));

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> deleteLanguageUseCase.execute(new DeleteEntityRequest(languageId, infoId)));

        assertThat(ex.getMessage()).isEqualTo("Language not found");
    }

    @Test
    void should_throwException_when_employmentInfoNotFound() {
        // given
        Long languageId = 999L;
        Long infoId = 1L;
        when(employmentInfoRepository.findById(1L)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> deleteLanguageUseCase.execute(new DeleteEntityRequest(languageId, infoId)));

        assertThat(ex.getMessage()).isEqualTo("EmploymentInfo not found");
    }

    // helper for test
    private Language createLanguageWithId(Long id, String languageName, String level) {
        Language language = new Language(languageName, level);
        try {
            java.lang.reflect.Field field = Language.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(language, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return language;
    }
}
