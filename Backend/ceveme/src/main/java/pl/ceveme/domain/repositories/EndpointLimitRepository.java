package pl.ceveme.domain.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.ceveme.domain.model.entities.EndpointLimit;
import pl.ceveme.domain.model.enums.EndpointType;
import pl.ceveme.domain.model.enums.UserRole;

import java.util.List;

@Repository
public interface EndpointLimitRepository extends JpaRepository<EndpointLimit, Long> {
    EndpointLimit findByRoleAndEndpointType(UserRole role, EndpointType endpointType);
    List<EndpointLimit> findByRole(UserRole role);
}
