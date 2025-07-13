package pl.ceveme.application.dto.gemini;

import pl.ceveme.application.dto.employmentInfo.EmploymentInfoResponse;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.entities.User;

public record DataContainer(JobOffer jobOffer, User user, EmploymentInfoResponse response) {
}
