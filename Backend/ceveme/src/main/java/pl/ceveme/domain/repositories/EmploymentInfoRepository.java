package pl.ceveme.domain.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.User;

import java.util.Optional;

@Repository
public interface EmploymentInfoRepository extends JpaRepository<EmploymentInfo, Long> {

    Optional<EmploymentInfo> findByUser(User user);

}
