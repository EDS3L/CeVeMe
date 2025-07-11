package pl.ceveme.infrastructure.external.gemini;

import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.employmentInfo.EmploymentInfoResponse;
import pl.ceveme.application.dto.gemini.GeminiRequest;
import pl.ceveme.application.mapper.EmploymentInfoMapper;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.JobOfferRepository;
import pl.ceveme.domain.repositories.UserRepository;

@Service
public class GeminiAi {
    private static final Logger log = LoggerFactory.getLogger(GeminiAi.class);

    // jest juz w bazie
    // controller z linku

    private final UserRepository userRepository;

    private final JobOfferRepository jobOfferRepository;
    private final HttpFetchAi fetchAi;
    private final EmploymentInfoMapper mapper;

    public GeminiAi(UserRepository userRepository, JobOfferRepository jobOfferRepository, HttpFetchAi fetchAi, EmploymentInfoMapper mapper) {
        this.userRepository = userRepository;
        this.jobOfferRepository = jobOfferRepository;
        this.fetchAi = fetchAi;
        this.mapper = mapper;
    }

    public String response(GeminiRequest request) {
        User user = userRepository.findByEmail(new Email(request.email()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        JobOffer offer = jobOfferRepository.findById(request.id())
                .orElseThrow(() -> new IllegalArgumentException("Job offer not found"));
        EmploymentInfo employmentInfo = user.getEmploymentInfo();
        EmploymentInfoResponse response = mapper.toResponse(employmentInfo);
        log.info("User {}", user.toString());
        log.info("Job offer {}", offer.toString());
        log.info("Employment info {}", response);

        String prompt = """
                powiedz coś o mnie i czy pasuje do tej pracy?
                
                """.concat(offer.getResponsibilities()).concat("Pracowalem jako developer, mam 22 lata i jestem wyspecjalizowany w Java oraz Docker");

        return fetchAi.getResponse(prompt).text();
    }
}
