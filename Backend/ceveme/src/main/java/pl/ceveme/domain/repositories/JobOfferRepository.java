package pl.ceveme.domain.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.ceveme.domain.model.entities.JobOffer;

public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {
}
