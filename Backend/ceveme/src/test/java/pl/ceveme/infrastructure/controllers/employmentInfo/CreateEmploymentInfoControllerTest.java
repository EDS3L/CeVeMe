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
import pl.ceveme.application.usecase.employmentInfo.course.CreateCourseUseCase;
import pl.ceveme.application.usecase.employmentInfo.experience.CreateExperienceUseCase;
import pl.ceveme.application.usecase.employmentInfo.language.CreateLanguageUseCase;
import pl.ceveme.application.usecase.employmentInfo.link.CreateLinkUseCase;
import pl.ceveme.application.usecase.employmentInfo.portfolio.CreatePortfolioItemUseCase;
import pl.ceveme.application.usecase.employmentInfo.skill.CreateSkillUseCase;
import pl.ceveme.domain.model.entities.Skill;
import pl.ceveme.domain.model.entities.User;

import java.time.LocalDate;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CreateEmploymentInfoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper;
    private User testUser;
    private Authentication testAuthentication;

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
        
        testUser = new User();
        try {
            java.lang.reflect.Field field = User.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(testUser, 1L);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        testAuthentication = new UsernamePasswordAuthenticationToken(testUser, null, Collections.emptyList());
    }

    @Test
    void should_createEmploymentInfo_when_valueIsCorrect() throws Exception {
        // Given
        EmploymentInfoRequest request = new EmploymentInfoRequest(1L,Collections.emptyList(),Collections.emptyList(),Collections.emptyList(),Collections.emptyList(),Collections.emptyList(),Collections.emptyList(),Collections.emptyList(),Collections.emptyList(),"mta1007@wp.pl");
        EmploymentInfoResponse response = new EmploymentInfoResponse(
                1L,
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
        mockMvc.perform(post("/api/employmentInfo/create/create")
                        .with(authentication(testAuthentication))
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
                1L,
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
        mockMvc.perform(get("/api/employmentInfo/get/{email}", userEmail)
                        .with(authentication(testAuthentication)))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(expectedResponse)));
    }

    @Test
    void should_createSkill_when_valueIsCorrect() throws Exception {
        // Given
        Long userId = 1L;
        SkillRequest request = new SkillRequest(1L, "Java", Skill.Type.TECHNICAL, userId);
        SkillResponse response = new SkillResponse(1L, "Java", Skill.Type.TECHNICAL, "Skill added successfully");
        given(createSkillUseCase.execute(any(SkillRequest.class), any(Long.class))).willReturn(response);

        // When & Then
        mockMvc.perform(post("/api/employmentInfo/create/skill")
                        .with(authentication(testAuthentication))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().json(objectMapper.writeValueAsString(response)));
    }

    @Test
    void should_createExperience_when_valueIsCorrect() throws Exception {
        // Given
        Long userId = 1L;
        ExperienceRequest request = new ExperienceRequest(
                1L,
                "Google",
                LocalDate.of(2020, 1, 15),
                null,
                true,
                "Senior Software Engineer",
                "Developing high-performance web applications.",
                "Led a team of 5 developers.",
                userId
        );
        ExperienceResponse response = new ExperienceResponse(1L, "Google", "Senior Software Engineer", "Experience added successfully");
        given(createExperienceUseCase.execute(any(ExperienceRequest.class), any(Long.class))).willReturn(response);

        // When & Then
        mockMvc.perform(post("/api/employmentInfo/create/experience")
                        .with(authentication(testAuthentication))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().json(objectMapper.writeValueAsString(response)));
    }

    @Test
    void should_createCourse_when_valueIsCorrect() throws Exception {
        // Given
        Long userId = 1L;
        CourseRequest request = new CourseRequest(
                1L,
                "Advanced Spring Boot",
                LocalDate.of(2023, 5, 20),
                "A comprehensive course on Spring Boot.",
                userId
        );
        CourseResponse response = new CourseResponse(1L, "Advanced Spring Boot", LocalDate.of(2023, 5, 20), "Course added successfully");
        given(createCourseUseCase.execute(any(CourseRequest.class), any(Long.class))).willReturn(response);

        // When & Then
        mockMvc.perform(post("/api/employmentInfo/create/course")
                        .with(authentication(testAuthentication))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().json(objectMapper.writeValueAsString(response)));
    }

    @Test
    void should_createCertificate_when_valueIsCorrect() throws Exception {
        // Given
        Long userId = 1L;
        CertificateRequest request = new CertificateRequest(
                1L,
                "Oracle Certified Professional, Java SE 11 Developer",
                LocalDate.of(2022, 8, 10),
                userId
        );
        CertificateResponse response = new CertificateResponse(1L, "Oracle Certified Professional, Java SE 11 Developer", LocalDate.of(2022, 8, 10), "Certificate added successfully");
        given(createCertificateUseCase.execute(any(CertificateRequest.class), any(Long.class))).willReturn(response);

        // When & Then
        mockMvc.perform(post("/api/employmentInfo/create/certificate")
                        .with(authentication(testAuthentication))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().json(objectMapper.writeValueAsString(response)));
    }

    @Test
    void should_createLanguage_when_valueIsCorrect() throws Exception {
        // Given
        Long userId = 1L;
        LanguageRequest request = new LanguageRequest(1L, "English", "C1", userId);
        LanguageResponse response = new LanguageResponse(1L, "English", "C1", "Language added successfully");
        given(createLanguageUseCase.execute(any(LanguageRequest.class), any(Long.class))).willReturn(response);

        // When & Then
        mockMvc.perform(post("/api/employmentInfo/create/language")
                        .with(authentication(testAuthentication))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().json(objectMapper.writeValueAsString(response)));
    }

    @Test
    void should_createLink_when_valueIsCorrect() throws Exception {
        // Given
        Long userId = 1L;
        LinkRequest request = new LinkRequest(1L, "GitHub Profile", "https://github.com/johndoe", userId);
        LinkResponse response = new LinkResponse(1L, "GitHub Profile", "https://github.com/johndoe", "Link added successfully");
        given(createLinkUseCase.execute(any(LinkRequest.class), any(Long.class))).willReturn(response);

        // When & Then
        mockMvc.perform(post("/api/employmentInfo/create/link")
                        .with(authentication(testAuthentication))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().json(objectMapper.writeValueAsString(response)));
    }

    @Test
    void should_createPortfolioItem_when_valueIsCorrect() throws Exception {
        // Given
        Long userId = 1L;
        PortfolioItemsRequest request = new PortfolioItemsRequest(1L, "Personal Website", "A personal portfolio website built with React.", "https://example.com", userId);
        PortfolioItemsResponse response = new PortfolioItemsResponse(1L, "Personal Website", "A personal portfolio website built with React.", "Portfolio item added successfully");
        given(createPortfolioItemUseCase.execute(any(PortfolioItemsRequest.class), any(Long.class))).willReturn(response);

        // When & Then
        mockMvc.perform(post("/api/employmentInfo/create/portfolioItem")
                        .with(authentication(testAuthentication))
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
        mockMvc.perform(post("/api/employmentInfo/create/certificate")
                        .with(authentication(testAuthentication))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void should_returnNotFound_when_pathVariableIsEmpty() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/employmentInfo/create")
                        .with(authentication(testAuthentication)))
                .andExpect(status().isNotFound());
    }

    @Test
    void should_returnUnsupportedMediaType_when_contentTypeIsInvalid() throws Exception {
        // Given
        EmploymentInfoRequest request = new EmploymentInfoRequest(1L,Collections.emptyList(),Collections.emptyList(),Collections.emptyList(),Collections.emptyList(),Collections.emptyList(),Collections.emptyList(),Collections.emptyList(),Collections.emptyList(),"mta1007@wp.pl");

        // When & Then
        mockMvc.perform(post("/api/employmentInfo/create/create")
                        .with(authentication(testAuthentication))
                        .contentType(MediaType.TEXT_PLAIN)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnsupportedMediaType());
    }

    @Test
    void should_returnBadRequest_when_requestBodyIsEmpty() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/employmentInfo/create/create")
                        .with(authentication(testAuthentication))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(""))
                .andExpect(status().isBadRequest());
    }
}