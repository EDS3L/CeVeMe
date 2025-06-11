package pl.ceveme.domain.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.ceveme.domain.model.entities.Skill;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
}
