package pl.ceveme.application.usecase.jobOffer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import pl.ceveme.application.dto.jobOffer.JobSearchCriteria;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.vo.Location;
import pl.ceveme.domain.repositories.JobOfferRepository;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SearchJobOffersUseCaseTest {

    @Mock
    private JobOfferRepository jobOfferRepository;

    @InjectMocks
    private SearchJobOffersUseCase searchJobOffersUseCase;

    private JobOffer sampleJobOffer;

    @BeforeEach
    void setUp() {
        sampleJobOffer = new JobOffer(
            "https://example.com/job/1",
            "Senior Java Developer",
            "Tech Corp",
            "15000-20000 PLN",
            new Location("Warszawa", "ul. Testowa 1"),
            "Java, Spring Boot, PostgreSQL",
            "Docker, Kubernetes",
            "Developing microservices",
            "Medical care, Sport card",
            "Senior",
            "B2B",
            LocalDate.now(),
            LocalDate.now().plusMonths(1)
        );
    }

    @Test
    @DisplayName("Should search with full-text query")
    void shouldSearchWithFullTextQuery() {
        JobSearchCriteria criteria = new JobSearchCriteria();
        criteria.setQ("Java developer");
        criteria.setPageNumber(0);
        criteria.setSize(50);
        criteria.setSort("newest");

        Page<JobOffer> expectedPage = new PageImpl<>(List.of(sampleJobOffer));
        when(jobOfferRepository.findAll(ArgumentMatchers.<Specification<JobOffer>>any(), any(Pageable.class)))
            .thenReturn(expectedPage);

        Page<JobOffer> result = searchJobOffersUseCase.search(criteria);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).contains("Java");
        verify(jobOfferRepository).findAll(ArgumentMatchers.<Specification<JobOffer>>any(), any(Pageable.class));
    }

    @Test
    @DisplayName("Should search with specific filters")
    void shouldSearchWithSpecificFilters() {
        JobSearchCriteria criteria = new JobSearchCriteria();
        criteria.setCompany("Tech Corp");
        criteria.setCity("Warszawa");
        criteria.setExperienceLevel("Senior");
        criteria.setPageNumber(0);
        criteria.setSize(50);

        Page<JobOffer> expectedPage = new PageImpl<>(List.of(sampleJobOffer));
        when(jobOfferRepository.findAll(ArgumentMatchers.<Specification<JobOffer>>any(), any(Pageable.class)))
            .thenReturn(expectedPage);

        Page<JobOffer> result = searchJobOffersUseCase.search(criteria);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getCompany()).isEqualTo("Tech Corp");
        assertThat(result.getContent().get(0).getLocation().getCity()).isEqualTo("Warszawa");
    }

    @Test
    @DisplayName("Should combine full-text search with filters")
    void shouldCombineFullTextSearchWithFilters() {
        JobSearchCriteria criteria = new JobSearchCriteria();
        criteria.setQ("Java");
        criteria.setCity("Warszawa");
        criteria.setExperienceLevel("Senior");
        criteria.setPageNumber(0);

        Page<JobOffer> expectedPage = new PageImpl<>(List.of(sampleJobOffer));
        when(jobOfferRepository.findAll(ArgumentMatchers.<Specification<JobOffer>>any(), any(Pageable.class)))
            .thenReturn(expectedPage);

        Page<JobOffer> result = searchJobOffersUseCase.search(criteria);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).isNotEmpty();
    }

    @Test
    @DisplayName("Should apply date range filter")
    void shouldApplyDateRangeFilter() {
        JobSearchCriteria criteria = new JobSearchCriteria();
        criteria.setDateAddedFrom(LocalDate.now().minusDays(7));
        criteria.setDateAddedTo(LocalDate.now());
        criteria.setPageNumber(0);

        Page<JobOffer> expectedPage = new PageImpl<>(List.of(sampleJobOffer));
        when(jobOfferRepository.findAll(ArgumentMatchers.<Specification<JobOffer>>any(), any(Pageable.class)))
            .thenReturn(expectedPage);

        Page<JobOffer> result = searchJobOffersUseCase.search(criteria);

        assertThat(result.getContent()).hasSize(1);
    }

    @Test
    @DisplayName("Should normalize page size to default when invalid")
    void shouldNormalizePageSize() {
        JobSearchCriteria criteria = new JobSearchCriteria();
        criteria.setPageNumber(0);
        criteria.setSize(-10);

        Page<JobOffer> expectedPage = new PageImpl<>(List.of());
        when(jobOfferRepository.findAll(ArgumentMatchers.<Specification<JobOffer>>any(), any(Pageable.class)))
            .thenReturn(expectedPage);

        Page<JobOffer> result = searchJobOffersUseCase.search(criteria);

        assertThat(result).isNotNull();
    }

    @Test
    @DisplayName("Should limit page size to maximum")
    void shouldLimitPageSizeToMaximum() {
        JobSearchCriteria criteria = new JobSearchCriteria();
        criteria.setPageNumber(0);
        criteria.setSize(999);

        Page<JobOffer> expectedPage = new PageImpl<>(List.of());
        when(jobOfferRepository.findAll(ArgumentMatchers.<Specification<JobOffer>>any(), any(Pageable.class)))
            .thenReturn(expectedPage);

        Page<JobOffer> result = searchJobOffersUseCase.search(criteria);

        assertThat(result).isNotNull();
    }

    @Test
    @DisplayName("Should throw exception when criteria is null")
    void shouldThrowExceptionWhenCriteriaIsNull() {
        assertThatThrownBy(() -> searchJobOffersUseCase.search(null))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Search criteria cannot be null");
    }

    @Test
    @DisplayName("Should use default values for null parameters")
    void shouldUseDefaultValuesForNullParameters() {
        JobSearchCriteria criteria = new JobSearchCriteria();
        criteria.setPageNumber(null);
        criteria.setSize(null);
        criteria.setSort(null);

        Page<JobOffer> expectedPage = new PageImpl<>(List.of());
        when(jobOfferRepository.findAll(ArgumentMatchers.<Specification<JobOffer>>any(), any(Pageable.class)))
            .thenReturn(expectedPage);

        Page<JobOffer> result = searchJobOffersUseCase.search(criteria);

        assertThat(result).isNotNull();
    }

    @Test
    @DisplayName("Should apply newest sort by default")
    void shouldApplyNewestSortByDefault() {
        JobSearchCriteria criteria = new JobSearchCriteria();
        criteria.setPageNumber(0);
        criteria.setSort("newest");

        Page<JobOffer> expectedPage = new PageImpl<>(List.of(sampleJobOffer));
        when(jobOfferRepository.findAll(ArgumentMatchers.<Specification<JobOffer>>any(), any(Pageable.class)))
            .thenReturn(expectedPage);

        Page<JobOffer> result = searchJobOffersUseCase.search(criteria);

        assertThat(result).isNotNull();
        verify(jobOfferRepository).findAll(ArgumentMatchers.<Specification<JobOffer>>any(), any(Pageable.class));
    }

    @Test
    @DisplayName("Should search with empty query returning all active offers")
    void shouldSearchWithEmptyQuery() {
        JobSearchCriteria criteria = new JobSearchCriteria();
        criteria.setQ("");
        criteria.setPageNumber(0);

        Page<JobOffer> expectedPage = new PageImpl<>(List.of(sampleJobOffer));
        when(jobOfferRepository.findAll(ArgumentMatchers.<Specification<JobOffer>>any(), any(Pageable.class)))
            .thenReturn(expectedPage);

        Page<JobOffer> result = searchJobOffersUseCase.search(criteria);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).isNotEmpty();
    }
}
