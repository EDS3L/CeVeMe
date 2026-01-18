package pl.ceveme.application.usecase.location;

import org.springframework.cglib.core.Local;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.location.BoundingBox;
import pl.ceveme.application.dto.location.FindJobsInRadiusCommand;
import pl.ceveme.application.dto.location.LocationResponse;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.repositories.JobOfferRepository;
import pl.ceveme.infrastructure.external.location.OpenStreetMapImpl;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
public class FindJobsInRadiusUseCase {

    private final OpenStreetMapImpl openStreetMap;
    private final JobOfferRepository jobOfferRepository;

    public FindJobsInRadiusUseCase(OpenStreetMapImpl openStreetMap, JobOfferRepository jobOfferRepository) {
        this.openStreetMap = openStreetMap;
        this.jobOfferRepository = jobOfferRepository;
    }

    public List<JobOffer> execute(FindJobsInRadiusCommand command) throws IOException, InterruptedException {
        LocationResponse locationResponse = openStreetMap.findByCityName(command.city());

        BoundingBox boundingBox = GeoUtils.calculateBoundingBox(locationResponse.latitude(),locationResponse.longitude(),command.kmDistance());
        LocalDate today = LocalDate.now();
        return jobOfferRepository.findAllOffersAround(boundingBox.minLat(),boundingBox.maxLat(),boundingBox.minLon(),boundingBox.maxLon(),today);
    }
}
