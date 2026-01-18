package pl.ceveme.application.usecase.location;


import org.springframework.stereotype.Component;
import pl.ceveme.application.dto.location.LocationResponse;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.repositories.JobOfferRepository;
import pl.ceveme.infrastructure.external.location.OpenStreetMapImpl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class FindLocationUseCase {

    private final JobOfferRepository jobOfferRepository;
    private final OpenStreetMapImpl openStreetMapImpl;

    public FindLocationUseCase(JobOfferRepository jobOfferRepository, OpenStreetMapImpl openStreetMapImpl) {
        this.jobOfferRepository = jobOfferRepository;
        this.openStreetMapImpl = openStreetMapImpl;
    }


    public List<LocationResponse> execute() throws IOException, InterruptedException {
        List<JobOffer> jobOffers = jobOfferRepository.findAll().stream()
                .filter(jb -> jb.getLocation() != null)
                .filter(jb -> jb.getLocation().getCity() != null)
                .filter(jb -> jb.getLocation().getLongitude() == null ||  jb.getLocation().getLatitude() == null)
                .toList();

        List<LocationResponse> locationResponses = new ArrayList<>();
        for (JobOffer jobOffer : jobOffers) {
            locationResponses.add(getLatAndLon(jobOffer));
        }

        return locationResponses;
    }


    private LocationResponse getLatAndLon(JobOffer jobOffer) throws IOException, InterruptedException {
        if (jobOffer.getLocation().getCity() == null) return null;

        String city = jobOffer.getLocation().getCity();
        String street = jobOffer.getLocation().getStreet();

        boolean hasCity = city != null && !city.isBlank();
        boolean hasStreet = street != null && !street.isBlank();

        LocationResponse locationResponse;
        if (hasCity && hasStreet) {
            locationResponse = openStreetMapImpl.findByCityAndStreetName(city, street);
        } else if (hasCity) {
            locationResponse = openStreetMapImpl.findByCityName(city);
        } else {
            return null;
        }

        if (locationResponse == null) return null;

        jobOffer.getLocation().setLatitude(locationResponse.latitude());
        jobOffer.getLocation().setLongitude(locationResponse.longitude());

        jobOfferRepository.save(jobOffer);

        return locationResponse;
    }

}
