package pl.ceveme.application.usecase.scrap;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.ceveme.application.dto.scrap.ScrapResponse;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.infrastructure.external.scrap.bulldogJob.BulldogJobScrapper;

import java.io.IOException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ScrapBulldogJobUseCaseTest {

    private static final Logger log = LoggerFactory.getLogger(ScrapBulldogJobUseCaseTest.class);

    private BulldogJobScrapper scrapper;
    private ScrapBulldogJobUseCase useCase;

    @BeforeEach
    void setUp() {
        scrapper =  mock(BulldogJobScrapper.class);
        useCase = new ScrapBulldogJobUseCase(scrapper);
    }

    @Test
    void should_returnScrapResponse_when_ScrapWasSuccessful() throws IOException {
        // given
        JobOffer jobOffer = new JobOffer();
        JobOffer jobOffer1 = new JobOffer();
        var mockJobs = List.of(jobOffer1, jobOffer);
        when(scrapper.createJobs()).thenReturn(mockJobs);

        // when
        ScrapResponse response = useCase.execute();
        // then
        assertEquals("Scrap successful!", response.message());
        verify(scrapper, times(1)).createJobs();
    }

}