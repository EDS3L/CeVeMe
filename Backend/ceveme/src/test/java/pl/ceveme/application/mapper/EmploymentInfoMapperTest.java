package pl.ceveme.application.mapper;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import pl.ceveme.application.dto.employmentInfo.*;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Language;
import pl.ceveme.domain.model.entities.PortfolioItem;
import pl.ceveme.domain.model.entities.Skill;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class EmploymentInfoMapperTest {

    @Mock
    private EmploymentInfoMapper mapper = new EmploymentInfoMapperImpl();

    private LanguageDto lang(String name, String lvl) {
        return new LanguageDto(name,lvl);
    }

    @Test
    void should_map_when_allValueCorrect() {
        // given
        LanguageDto languageDto = new LanguageDto("English", "B2");
        CertificateDto certificateDto = new CertificateDto("Java", LocalDate.of(2003,01,12));
        ExperienceDto experienceDto = new ExperienceDto("DeveloperHouse", LocalDate.of(2019,1,1), LocalDate.of(2020,1,1),false,"Developer","I make job good","Make website work");
        CourseDto courseDto = new CourseDto("Spring Boot", LocalDate.of(2020,5,5), "description");
        SkillDto skillDto = new SkillDto("Early bird", Skill.Type.SOFT);
        PortfolioItemsDto portfolioItem = new PortfolioItemsDto("Projekt ABC", "Zajefajny projekt");
        LinkDto link = new LinkDto("github", "https://github.com/ceveme");

        EmploymentInfoRequest request = new EmploymentInfoRequest(
                List.of(languageDto),
                List.of(certificateDto),
                List.of(experienceDto),
                List.of(courseDto),
                List.of(skillDto),
                List.of(portfolioItem),
                List.of(link),
                "test@wp.pl"
        );
        // when
        EmploymentInfo response = mapper.toEntity(request);

        // then
        assertThat(response).isNotNull();
        assertEquals(1,response.getLanguages().size());
        assertThat(response.getLanguages().getFirst().getName()).isEqualTo("English");
        assertThat(response.getLanguages().getFirst().getEmploymentInfo()).isSameAs(response);
        assertThat(response.getCertificates().getFirst().getName()).isEqualTo("Java");
        assertEquals(1,response.getSkills().size());
        assertEquals(1,response.getExperiences().size());
    }

    @Test
    void should_map_entity_to_Response() {
        // given
        EmploymentInfo entity = new EmploymentInfo();
        Language language = new Language("English", "B2");
        language.setEmploymentInfo(entity);

        entity.setLanguages(List.of(language));

        // when
        EmploymentInfoResponse response = mapper.toResponse(entity);

        // then
        assertThat(response.languages()).isNotNull();
        assertEquals(1,response.languages().size());
        assertThat(response.languages().getFirst().name()).isEqualTo("English");
    }



    @Test
    void should_createEmptyList_when_valueIsEmpty() {
        // given
        EmploymentInfoRequest request = new EmploymentInfoRequest(null,null,null,null,null,null,null,"test@wp.pl");

        //when

        EmploymentInfo entity = mapper.toEntity(request);

        // that
        assertThat(entity.getSkills()).isNull();
    }

}