package pl.ceveme.domain.model.entities;

import org.junit.jupiter.api.Test;
;

class EmploymentInfoTest {



    @Test
    void should_addCertificate_when_valueIsCorrect() {
        // given
        Certificate certificate = new Certificate();
        EmploymentInfo employmentInfo1 = new EmploymentInfo();

        // when + then
        certificate.setEmploymentInfo(employmentInfo1);
    }



    @Test
    void should_addCourse_when_valueIsCorrect() {
        // given
        Course course = new Course();
        EmploymentInfo employmentInfo1 = new EmploymentInfo();

        // when + then
        course.setEmploymentInfo(employmentInfo1);
    }

    @Test
    void should_addExperience_when_valueIsCorrect() {
        // given
        Experience experience = new Experience();
        EmploymentInfo employmentInfo1 = new EmploymentInfo();

        // when + then
        experience.setEmploymentInfo(employmentInfo1);
    }
    @Test
    void should_addLanguage_when_valueIsCorrect() {
        // given
        Language language = new Language();
        EmploymentInfo employmentInfo1 = new EmploymentInfo();

        // when + then
        language.setEmploymentInfo(employmentInfo1);
    }

    @Test
    void should_addSkill_when_valueIsCorrect() {
        // given
        Certificate certificate = new Certificate();
        EmploymentInfo employmentInfo1 = new EmploymentInfo();

        // when + then
        certificate.setEmploymentInfo(employmentInfo1);
    }
}