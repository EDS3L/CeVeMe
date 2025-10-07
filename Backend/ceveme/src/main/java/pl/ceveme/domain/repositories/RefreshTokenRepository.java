package pl.ceveme.domain.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.ceveme.domain.model.entities.Device;
import pl.ceveme.domain.model.entities.RefreshToken;
import pl.ceveme.domain.model.entities.User;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken,Long> {

    Optional<RefreshToken> findByJit(String jit);

    void deleteByJit(String jit);

    void deleteByUser(User user);

    void deleteByExpiresAtBefore(Instant now);

    long countByUser(User user);


    @Query("SELECT DISTINCT rt.device FROM RefreshToken rt WHERE rt.user.id = :userId")
    List<Device> findDistinctDevicesByUserId(@Param("userId") Long userId);
}
