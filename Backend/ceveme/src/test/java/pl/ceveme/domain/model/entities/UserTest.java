package pl.ceveme.domain.model.entities;

import org.junit.jupiter.api.Test;
import pl.ceveme.domain.model.vo.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.when;


class UserTest {

    @Test
    void createNewUser() {
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
    void changePassword() {
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
    void changeName() {
        //given
        User user = new User();
        Name name = new Name("Tomasz");
        user.setName(name);
        //when
        Name name2 = new Name("Tomaszz");
        user.changeName(name2);
        //then
        assertThat(user.getName()).isEqualTo(name2);
    }

    @Test
    void changeSurname() {
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
    void changeEmail() {
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
    void changePhoneNumber() {
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
    void addCertificate() {
    }

    @Test
    void addCourse() {
    }

    @Test
    void addExperience() {
    }

    @Test
    void addLanguage() {
    }

    @Test
    void addSkill() {
    }
}