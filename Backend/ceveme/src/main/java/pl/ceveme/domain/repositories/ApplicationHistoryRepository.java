package pl.ceveme.domain.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.ceveme.domain.model.entities.ApplicationHistory;

@Repository
public interface ApplicationHistoryRepository extends JpaRepository<ApplicationHistory, Long> {

    @Query("SELECT COUNT(*) FROM ApplicationHistory ah WHERE ah.status = :status AND ah.user.id = :userID")
    Integer statusByCount(@Param("status")ApplicationHistory.STATUS status, @Param("userID") Long userID);

    @Query("SELECT COUNT(*) FROM ApplicationHistory ah WHERE ah.user.id = :userID")
    Integer statusCount(@Param("userID") Long userID);
}
