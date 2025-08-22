package pl.ceveme.domain.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.ceveme.domain.model.entities.Link;

@Repository
public interface LinkRepository extends JpaRepository<Link, Long> {
}
