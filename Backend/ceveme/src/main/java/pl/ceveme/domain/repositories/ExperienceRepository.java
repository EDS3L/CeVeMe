package pl.ceveme.domain.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.ceveme.domain.model.entities.Experience;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience, Long> {
}
