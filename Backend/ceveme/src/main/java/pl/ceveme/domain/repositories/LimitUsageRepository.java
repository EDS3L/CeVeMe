package pl.ceveme.domain.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.ceveme.domain.model.entities.LimitUsage;

@Repository
public interface LimitUsageRepository extends JpaRepository<LimitUsage, Long> {
}
