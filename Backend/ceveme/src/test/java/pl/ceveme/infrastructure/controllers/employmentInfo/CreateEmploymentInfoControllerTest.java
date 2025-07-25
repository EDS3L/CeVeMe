package pl.ceveme.infrastructure.controllers.employmentInfo;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import pl.ceveme.application.dto.employmentInfo.EmploymentInfoRequest;
import pl.ceveme.application.dto.employmentInfo.EmploymentInfoResponse;
import pl.ceveme.application.dto.entity.certificate.CertificateRequest;
import pl.ceveme.application.dto.entity.certificate.CertificateResponse;
import pl.ceveme.application.dto.entity.course.CourseRequest;
import pl.ceveme.application.dto.entity.course.CourseResponse;
import pl.ceveme.application.dto.entity.experience.ExperienceRequest;
import pl.ceveme.application.dto.entity.experience.ExperienceResponse;
import pl.ceveme.application.dto.entity.language.LanguageRequest;
import pl.ceveme.application.dto.entity.language.LanguageResponse;
import pl.ceveme.application.dto.entity.link.LinkRequest;
import pl.ceveme.application.dto.entity.link.LinkResponse;
import pl.ceveme.application.dto.entity.portfolioItems.PortfolioItemsRequest;
import pl.ceveme.application.dto.entity.portfolioItems.PortfolioItemsResponse;
import pl.ceveme.application.dto.entity.skill.SkillRequest;
import pl.ceveme.application.dto.entity.skill.SkillResponse;
import pl.ceveme.application.usecase.employmentInfo.*;
import pl.ceveme.application.usecase.employmentInfo.certificate.CreateCertificateUseCase;
import pl.ceveme.domain.model.entities.Skill;

import java.time.LocalDate;
import java.util.Collections;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser
class CreateEmploymentInfoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @MockitoBean
    private CreateEmploymentInfoUseCase createEmploymentInfoUseCase;

    @MockitoBean
    private GetEmploymentInfoUseCase getEmploymentInfoUseCase;

    @MockitoBean
    private CreateSkillUseCase createSkillUseCase;

    @MockitoBean
    private CreateExperienceUseCase createExperienceUseCase;

    @MockitoBean
    private CreateCourseUseCase createCourseUseCase;

    @MockitoBean
    private CreateCertificateUseCase createCertificateUseCase;

    @MockitoBean
    private CreateLanguageUseCase createLanguageUseCase;

    @MockitoBean
    private CreateLinkUseCase createLinkUseCase;

    @MockitoBean
    private CreatePortfolioItemUseCase createPortfolioItemUseCase;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    }

    @Test
    void should_createEmploymentInfo_when_valueIsCorrect() throws Exception {
        // Given
        EmploymentInfoRequest request = new EmploymentInfoRequest(Collections.emptyList(),Collections.emptyList(),Collections.emptyList(),Collections.emptyList(),Collections.emptyList(),Collections.emptyList(),Collections.emptyList(),Collections.emptyList(),"mta1007@wp.pl");
        EmploymentInfoResponse response = new EmploymentInfoResponse(
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyList()
        );
        given(createEmploymentInfoUseCase.execute(request)).willReturn(response);

        // When & Then
        mockMvc.perform(post("/api/employmentInfo/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().json(objectMapper.writeValueAsString(response)));
    }

    @Test
    void should_getEmploymentInfo_when_emailIsCorrect() throws Exception {
        // Given
        String userEmail = "mta1997@wp.pl";
        EmploymentInfoResponse expectedResponse = new EmploymentInfoResponse(
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyList()
        );
        given(getEmploymentInfoUseCase.execute(userEmail)).willReturn(expectedResponse);

        // When & Then
        mockMvc.perform(get("/api/employmentInfo/{email}", userEmail))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(expectedResponse)));
    }

    @Test
    void should_createSkill_when_valueIsCorrect() throws Exception {
        // Given
        SkillRequest request = new SkillRequest(1L,"test@example.com", "Java", Skill.Type.TECHNICAL);
        SkillResponse response = new SkillResponse("Java", Skill.Type.TECHNICAL, "Skill added successfully");
        given(createSkillUseCase.execute(request)).willReturn(response);

        // When & Then
        mockMvc.perform(post("/api/employmentInfo/skill")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().json(objectMapper.writeValueAsString(response)));
    }

    @Test
    void should_createExperience_when_valueIsCorrect() throws Exception {
        // Given
        ExperienceRequest request = new ExperienceRequest(
                1L,
                "test@example.com",
                "Google",
                LocalDate.of(2020, 1, 15),
                null,
                true,
                "Senior Software Engineer",
                "Developing high-performance web applications.",
                "Led a team of 5 developers."
        );
        ExperienceResponse response = new ExperienceResponse("Google", "Senior Software Engineer", "Experience added successfully");
        given(createExperienceUseCase.execute(request)).willReturn(response);

        // When & Then
        mockMvc.perform(post("/api/employmentInfo/experience")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().json(objectMapper.writeValueAsString(response)));
    }

    @Test
    void should_createCourse_when_valueIsCorrect() throws Exception {
        // Given
        CourseRequest request = new CourseRequest(
                1L,
                "test@example.com",
                "Advanced Spring Boot",
                LocalDate.of(2023, 5, 20),
                "A comprehensive course on Spring Boot."
        );
        CourseResponse response = new CourseResponse("Advanced Spring Boot", LocalDate.of(2023, 5, 20), "Course added successfully");
        given(createCourseUseCase.execute(request)).willReturn(response);

        // When & Then
        mockMvc.perform(post("/api/employmentInfo/course")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().json(objectMapper.writeValueAsString(response)));
    }

    @Test
    void should_createCertificate_when_valueIsCorrect() throws Exception {
        // Given
        CertificateRequest request = new CertificateRequest(
                1L,
                "test@example.com",
                "Oracle Certified Professional, Java SE 11 Developer",
                LocalDate.of(2022, 8, 10)
        );
        CertificateResponse response = new CertificateResponse("Oracle Certified Professional, Java SE 11 Developer", LocalDate.of(2022, 8, 10), "Certificate added successfully");
        given(createCertificateUseCase.execute(request)).willReturn(response);

        // When & Then
        mockMvc.perform(post("/api/employmentInfo/certificate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().json(objectMapper.writeValueAsString(response)));
    }

    @Test
    void should_createLanguage_when_valueIsCorrect() throws Exception {
        // Given
        LanguageRequest request = new LanguageRequest(1L,"test@example.com", "English", "C1");
        LanguageResponse response = new LanguageResponse("English", "C1", "Language added successfully");
        given(createLanguageUseCase.execute(request)).willReturn(response);

        // When & Then
        mockMvc.perform(post("/api/employmentInfo/language")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().json(objectMapper.writeValueAsString(response)));
    }

    @Test
    void should_createLink_when_valueIsCorrect() throws Exception {
        // Given
        LinkRequest request = new LinkRequest(1L,"test@example.com", "GitHub Profile", "https://github.com/johndoe");
        LinkResponse response = new LinkResponse("GitHub Profile", "https://github.com/johndoe", "Link added successfully");
        given(createLinkUseCase.execute(request)).willReturn(response);

        // When & Then
        mockMvc.perform(post("/api/employmentInfo/link")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().json(objectMapper.writeValueAsString(response)));
    }

    @Test
    void should_createPortfolioItem_when_valueIsCorrect() throws Exception {
        // Given
        PortfolioItemsRequest request = new PortfolioItemsRequest(1L,"test@example.com", "Personal Website", "A personal portfolio website built with React.");
        PortfolioItemsResponse response = new PortfolioItemsResponse("Personal Website", "A personal portfolio website built with React.", "Portfolio item added successfully");
        given(createPortfolioItemUseCase.execute(request)).willReturn(response);

        // When & Then
        mockMvc.perform(post("/api/employmentInfo/portfolioItem")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().json(objectMapper.writeValueAsString(response)));
    }

    @Test
    void should_returnBadRequest_when_certificateValidationFails() throws Exception {
        // Given - Invalid JSON that should trigger validation
        String invalidJson = "{}";

        // When & Then
        mockMvc.perform(post("/api/employmentInfo/certificate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void should_returnNotFound_when_pathVariableIsEmpty() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/employmentInfo/"))
                .andExpect(status().isNotFound());
    }

    @Test
    void should_returnUnsupportedMediaType_when_contentTypeIsInvalid() throws Exception {
        // Given
        EmploymentInfoRequest request = new EmploymentInfoRequest(Collections.emptyList(),Collections.emptyList(),Collections.emptyList(),Collections.emptyList(),Collections.emptyList(),Collections.emptyList(),Collections.emptyList(),Collections.emptyList(),"mta1007@wp.pl");

        // When & Then
        mockMvc.perform(post("/api/employmentInfo/create")
                        .contentType(MediaType.TEXT_PLAIN)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnsupportedMediaType());
    }

    @Test
    void should_returnBadRequest_when_requestBodyIsEmpty() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/employmentInfo/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(""))
                .andExpect(status().isBadRequest());
    }
}