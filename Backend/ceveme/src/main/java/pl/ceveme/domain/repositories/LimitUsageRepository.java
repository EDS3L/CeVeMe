package pl.ceveme.domain.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.ceveme.domain.model.entities.LimitUsage;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.enums.EndpointType;
import pl.ceveme.domain.model.enums.UserRole;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LimitUsageRepository extends JpaRepository<LimitUsage, Long> {

    Integer countByUserAndEndpointTypeAndTimestampBetween(
            User user,
            EndpointType endpointType,
            LocalDateTime start,
            LocalDateTime end
    );

    List<LimitUsage> findByUserAndTimestampBetween(
            User user,
            LocalDateTime start,
            LocalDateTime end
    );

    @Query("""
            SELECT dailyLimit FROM EndpointLimit el 
            WHERE el.endpointType LIKE :endpointType AND 
            el.role LIKE :role
            """)
    Integer findDailyLimit(@Param("endpointType") EndpointType endpointType, @Param("role") UserRole userRole);

    @Query("""
            SELECT monthlyLimit FROM EndpointLimit el 
            WHERE el.endpointType LIKE :endpointType AND 
            el.role LIKE :role
            """)
    Integer findMonthlyLimit(@Param("endpointType") EndpointType endpointType, @Param("role") UserRole userRole);
}
