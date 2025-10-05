package pl.ceveme.domain.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.ceveme.domain.model.entities.Device;

public interface DeviceRepository extends JpaRepository<Device, Long> {
}
