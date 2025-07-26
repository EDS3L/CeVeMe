package pl.ceveme.application.usecase.employmentInfo.link;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.link.LinkRequest;
import pl.ceveme.application.dto.entity.link.LinkResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Link;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EditLinkUseCaseTest {

    @Mock
    private EmploymentInfoRepository employmentInfoRepository;

    @InjectMocks
    private EditLinkUseCase editLinkUseCase;

    @Test
    void should_editLink_when_linkExists() {
        // given
        Long employmentInfoId = 1L;
        Long linkId = 10L;
        Link link = new Link("Old Name", "Old Url");
        try {
            java.lang.reflect.Field field = Link.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(link, linkId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        LinkRequest request = new LinkRequest(linkId, "test@wp.pl", "Updated Name", "Updated Url");
        EmploymentInfo info = new EmploymentInfo();
        info.addLink(link);

        when(employmentInfoRepository.findById(employmentInfoId)).thenReturn(Optional.of(info));

        // when
        LinkResponse response = editLinkUseCase.execute(request, employmentInfoId);

        // then
        assertThat(response.title()).isEqualTo("Updated Name");
        assertThat(response.message()).isEqualTo("Link updated successfully");
    }

    @Test
    void should_throwException_when_linkNotFound() {
        // given
        Long employmentInfoId = 1L;
        LinkRequest request = new LinkRequest(99L, "test@wp.pl", "Name", "Url");
        EmploymentInfo info = new EmploymentInfo();

        when(employmentInfoRepository.findById(employmentInfoId)).thenReturn(Optional.of(info));

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editLinkUseCase.execute(request, employmentInfoId));

        assertThat(ex.getMessage()).isEqualTo("Link not found");
    }

    @Test
    void should_throwException_when_employmentInfoNotFound() {
        // given
        Long employmentInfoId = 999L;
        LinkRequest request = new LinkRequest(1L, "test@wp.pl", "Any", "Any");

        when(employmentInfoRepository.findById(employmentInfoId)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editLinkUseCase.execute(request, employmentInfoId));

        assertThat(ex.getMessage()).isEqualTo("EmploymentInfo not found");
    }
}
