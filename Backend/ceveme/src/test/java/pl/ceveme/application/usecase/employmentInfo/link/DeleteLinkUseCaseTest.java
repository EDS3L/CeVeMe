package pl.ceveme.application.usecase.employmentInfo.link;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
import pl.ceveme.application.dto.entity.link.LinkResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Link;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DeleteLinkUseCaseTest {

    @Mock
    private EmploymentInfoRepository employmentInfoRepository;

    @InjectMocks
    private DeleteLinkUseCase deleteLinkUseCase;

    @Test
    void should_deleteLink_when_exists() {
        // given
        Long linkId = 123L;
        Long infoId = 1L;
        Link link = createLinkWithId(linkId, "To delete", "Url");

        EmploymentInfo info = new EmploymentInfo();
        info.addLink(link);

        when(employmentInfoRepository.findById(infoId)).thenReturn(Optional.of(info));

        // when
        LinkResponse response = deleteLinkUseCase.execute(new DeleteEntityRequest(linkId, infoId));

        // then
        assertThat(response.title()).isEqualTo("To delete");
        assertThat(response.message()).isEqualTo("Link deleted successfully");
    }

    @Test
    void should_throwException_when_linkNotFound() {
        // given
        Long linkId = 999L;
        Long infoId = 1L;
        EmploymentInfo info = new EmploymentInfo();

        when(employmentInfoRepository.findById(infoId)).thenReturn(Optional.of(info));

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> deleteLinkUseCase.execute(new DeleteEntityRequest(linkId, infoId)));

        assertThat(ex.getMessage()).isEqualTo("Link not found");
    }

    @Test
    void should_throwException_when_employmentInfoNotFound() {
        // given
        Long linkId = 999L;
        Long infoId = 1L;
        when(employmentInfoRepository.findById(1L)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> deleteLinkUseCase.execute(new DeleteEntityRequest(linkId, infoId)));

        assertThat(ex.getMessage()).isEqualTo("EmploymentInfo not found");
    }

    // helper for test
    private Link createLinkWithId(Long id, String name, String url) {
        Link link = new Link(name, url);
        try {
            java.lang.reflect.Field field = Link.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(link, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return link;
    }
}
