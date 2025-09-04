package pl.ceveme.domain.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.ceveme.domain.model.entities.RefreshToken;
import pl.ceveme.domain.model.entities.User;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken,Long> {

    Optional<RefreshToken> findByJit(String jit);

    void deleteByJit(String jit);

    void deleteByUser(User user);

    void deleteByExpiresAtBefore(Instant now);

    long countByUser(User user);

}
