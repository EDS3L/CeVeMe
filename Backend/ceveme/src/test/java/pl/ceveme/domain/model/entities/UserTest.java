package pl.ceveme.domain.model.entities;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.domain.model.vo.*;
import pl.ceveme.domain.repositories.UserRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.when;

class UserTest {




    @Test
    void should_createUser_when_valuesAreCorrect() {
        //given
        Name name = new Name("Mateusz");
        Surname surname = new Surname("Kowalski");
        PhoneNumber phoneNumber = new PhoneNumber("+48696144222");
        String password = "Start1234!";
        Email email = new Email("mmm@wp.pl");
        List<Cv> cvList = new ArrayList<>();
        cvList.add(new Cv("asd", LocalDate.now(),new JobOffer(),new User(),new ApplicationHistory()));
        List<ApplicationHistory> applicationHistoryList = new ArrayList<>();
        applicationHistoryList.add(new ApplicationHistory(LocalDate.now(),new JobOffer()));
        EmploymentInfo employmentInfo = new EmploymentInfo();
        //when
        User user = User.createNewUser(name,surname,phoneNumber,password,email,cvList,applicationHistoryList,employmentInfo);
        //then

        assertThat(user).isNotNull();
        assertThat(user.getName()).isEqualTo(name);
        assertThat(user.getSurname()).isEqualTo(surname);
        assertThat(user.getPhoneNumber()).isEqualTo(phoneNumber);
        assertThat(user.getEmail()).isEqualTo(email);
        assertThat(user.getCvList()).isEqualTo(cvList);
        assertThat(user.getApplicationHistoryList()).isEqualTo(applicationHistoryList);
        assertThat(user.getEmploymentInfo()).isEqualTo(employmentInfo);
        assertThat(user.isActive()).isEqualTo(false);


    }

    @Test
    void should_changePassword_when_passwordIsCorrect() {
        //given
        User user = new User();
        Password password = new Password("Start1234!");
        user.setPassword(password.password());
        //when
        user.changePassword("newPasswd555!");
        //then
        assertThat(user.getPassword()).isEqualTo("newPasswd555!");
    }

    @Test
    void should_changeName_when_nameIsCorrect() {
        //given
        User user = new User();
        Name name = new Name("Tomasz");
        user.setName(name);
        //when
        Name name2 = new Name("Adam");
        user.changeName(name2);
        //then
        assertThat(user.getName()).isEqualTo(name2);
    }



    @Test
    void should_changeSurname_when_surnameIsCorrect() {
        User user = new User();
        Surname name = new Surname("Start");
        user.setSurname(name);
        //when
        Surname name2 = new Surname("Startt");
        user.changeSurname(name2);
        //then
        assertThat(user.getSurname()).isEqualTo(name2);
    }

    @Test
    void should_changeEmail_when_emailIsCorrect() {
        User user = new User();
        Email email = new Email("Start@wp.pl");
        user.setEmail(email);
        //when
        Email email2 = new Email("Start2@wp.pl");
        user.changeEmail(email2);
        //then
        assertThat(user.getEmail()).isEqualTo(email2);
    }

    @Test
    void should_changePhoneNumber_when_phoneNumberIsCorrect() {
        //given
        User user = new User();
        PhoneNumber phoneNumber = new PhoneNumber("+48786165293");
        user.setPhoneNumber(phoneNumber);
        //when
        PhoneNumber phoneNumber2 = new PhoneNumber("+48786165291");
        user.changePhoneNumber(phoneNumber2);
        //then
        assertThat(user.getPhoneNumber()).isEqualTo(phoneNumber2);
    }

    @Test
    void should_addCertificate_when_certificateIsCorrect() {
        // given
        EmploymentInfo employmentInfo = new EmploymentInfo();
        Certificate certificate = new Certificate();
        //when
        employmentInfo.addCertificate(certificate);

        // then

        assertThat(employmentInfo.getCertificates().getFirst()).isEqualTo(certificate);
    }

    @Test
    void should_addCourse_when_courseIsCorrect() {
        // given
        EmploymentInfo employmentInfo = new EmploymentInfo();
        Course course = new Course();
        //when
        employmentInfo.addCourse(course);

        // then

        assertThat(employmentInfo.getCourses().getFirst()).isEqualTo(course);
    }

    @Test
    void should_addExperience_when_experienceIsCorrect() {
        // given
        EmploymentInfo employmentInfo = new EmploymentInfo();
        Experience experience = new Experience();
        //when
        employmentInfo.addExperience(experience);

        // then

        assertThat(employmentInfo.getExperiences().getFirst()).isEqualTo(experience);
    }

    @Test
    void should_addLanguage_when_languageIsCorrect() {
        // given
        EmploymentInfo employmentInfo = new EmploymentInfo();
        Language language = new Language();
        //when
        employmentInfo.addLanguage(language);

        // then

        assertThat(employmentInfo.getLanguages().getFirst()).isEqualTo(language);
    }

    @Test
    void should_addSkill_when_skillIsCorrect() {
        // given
        EmploymentInfo employmentInfo = new EmploymentInfo();
        Skill skill = new Skill();
        //when
        employmentInfo.addSkill(skill);

        // then

        assertThat(employmentInfo.getSkills().getFirst()).isEqualTo(skill);
    }
}