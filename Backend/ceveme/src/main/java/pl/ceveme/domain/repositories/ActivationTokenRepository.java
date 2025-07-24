package pl.ceveme.domain.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.ceveme.domain.model.entities.ActivationToken;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ActivationTokenRepository extends JpaRepository<ActivationToken, Long> {

    Optional<ActivationToken> findByUuid(UUID uuid);
}
