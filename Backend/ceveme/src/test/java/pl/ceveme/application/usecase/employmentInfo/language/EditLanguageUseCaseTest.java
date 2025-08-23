package pl.ceveme.application.usecase.employmentInfo.language;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.language.LanguageRequest;
import pl.ceveme.application.dto.entity.language.LanguageResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Language;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EditLanguageUseCaseTest {

    @Mock
    private EmploymentInfoRepository employmentInfoRepository;

    @InjectMocks
    private EditLanguageUseCase editLanguageUseCase;

    @Test
    void should_editLanguage_when_languageExists() {
        // given
        Long employmentInfoId = 1L;
        Long languageId = 10L;
        Language language = new Language("Old Language", "C1");
        try {
            java.lang.reflect.Field field = Language.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(language, languageId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        LanguageRequest request = new LanguageRequest(languageId, "test@wp.pl", "Updated Language", "B2");
        EmploymentInfo info = new EmploymentInfo();
        info.addLanguage(language);

        when(employmentInfoRepository.findById(employmentInfoId)).thenReturn(Optional.of(info));

        // when
        LanguageResponse response = editLanguageUseCase.execute(request, employmentInfoId);

        // then
        assertThat(response.name()).isEqualTo("Updated Language");
        assertThat(response.message()).isEqualTo("Language updated successfully");
    }

    @Test
    void should_throwException_when_languageNotFound() {
        // given
        Long employmentInfoId = 1L;
        LanguageRequest request = new LanguageRequest(99L, "test@wp.pl", "Language", "C1");
        EmploymentInfo info = new EmploymentInfo();

        when(employmentInfoRepository.findById(employmentInfoId)).thenReturn(Optional.of(info));

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editLanguageUseCase.execute(request, employmentInfoId));

        assertThat(ex.getMessage()).isEqualTo("Language not found");
    }

    @Test
    void should_throwException_when_employmentInfoNotFound() {
        // given
        Long employmentInfoId = 999L;
        LanguageRequest request = new LanguageRequest(1L, "test@wp.pl", "Any", "C1");

        when(employmentInfoRepository.findById(employmentInfoId)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editLanguageUseCase.execute(request, employmentInfoId));

        assertThat(ex.getMessage()).isEqualTo("EmploymentInfo not found");
    }
}
