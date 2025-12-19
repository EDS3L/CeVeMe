package pl.ceveme.domain.services.jwt;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.ceveme.domain.repositories.RefreshTokenRepository;

@Service
public class ExpiredTokenCleanerService {


    private static final Logger log = LoggerFactory.getLogger(ExpiredTokenCleanerService.class);
    private final RefreshTokenRepository refreshTokenRepository;

    public ExpiredTokenCleanerService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteExpiredToken(String jit) {
        log.info("Start deletion");
        try {
            refreshTokenRepository.deleteByJit(jit);
        } catch (Exception e) {
            throw e;
        }
    }
}
