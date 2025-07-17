package pl.ceveme.application.dto.gemini;

import pl.ceveme.application.dto.employmentInfo.EmploymentInfoResponse;
import pl.ceveme.application.dto.scrap.JobOfferRequest;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.entities.User;

public record DataLinkContainer(JobOfferRequest jobOffer, User user, EmploymentInfoResponse response) {
}
