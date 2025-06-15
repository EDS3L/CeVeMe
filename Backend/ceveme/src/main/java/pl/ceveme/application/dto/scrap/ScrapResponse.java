package pl.ceveme.application.dto.scrap;

import pl.ceveme.domain.model.entities.JobOffer;

import java.util.List;

public record ScrapResponse(List<JobOffer> offerList, String message) {

}
