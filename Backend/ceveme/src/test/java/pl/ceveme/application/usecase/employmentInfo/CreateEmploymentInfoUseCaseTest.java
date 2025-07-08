package pl.ceveme.application.usecase.employmentInfo;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.employmentInfo.*;
import pl.ceveme.application.mapper.EmploymentInfoMapper;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Language;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.refEq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreateEmploymentInfoUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmploymentInfoMapper employmentInfoMapper;

    @InjectMocks
    private CreateEmploymentInfoUseCase useCase;

    @Test
    void should_createEmploymentInfo_when_valuesAreCorrect() {
        // given
        List<LanguageDto> languages = new ArrayList<>();
        List<CertificateDto> certificates  = new ArrayList<>();
        List<ExperienceDto> experiences  = new ArrayList<>();
        List<CourseDto> courses  = new ArrayList<>();
        List<SkillDto> skills  = new ArrayList<>();
        User user = new User();
        Email email = new Email("Start@wp.pl");
        EmploymentInfo employmentInfo = new EmploymentInfo();
        EmploymentInfoRequest employmentInfoRequest = new EmploymentInfoRequest(languages,certificates,experiences,courses,skills,email.email());
        EmploymentInfoResponse expectedResponse = new EmploymentInfoResponse(languages,certificates,experiences,courses,skills);


        // when
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(employmentInfoMapper.toEntity(employmentInfoRequest)).thenReturn(employmentInfo);
        when(employmentInfoMapper.toResponse(employmentInfo, "Successful create your infos")).thenReturn(expectedResponse);

        EmploymentInfoResponse response = useCase.execute(employmentInfoRequest);

        // then

        assertThat(response).isNotNull();
        assertEquals(expectedResponse, response);
        assertEquals(user, employmentInfo.getUser());
        assertEquals(employmentInfo, user.getEmploymentInfo());
        verify(userRepository).save(user);

    }


    @Test
    void should_throw_when_userNotFound() {

        //given
        List<LanguageDto> languages = new ArrayList<>();
        List<CertificateDto> certificates  = new ArrayList<>();
        List<ExperienceDto> experiences  = new ArrayList<>();
        List<CourseDto> courses  = new ArrayList<>();
        List<SkillDto> skills  = new ArrayList<>();
        String email = "test@wp.pl";
        EmploymentInfoRequest employmentInfoRequest = new EmploymentInfoRequest(languages,certificates,experiences,courses,skills,email);
        when(userRepository.findByEmail(new Email(email))).thenReturn(Optional.empty());


        // when & then
        assertThrows(IllegalArgumentException.class, () -> useCase.execute(employmentInfoRequest));
        verify(userRepository,never()).save(any());
    }


    @Test
    void should_throw_when_valuesAreCorrect() {

    }
}