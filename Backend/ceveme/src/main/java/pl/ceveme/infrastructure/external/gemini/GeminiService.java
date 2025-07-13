package pl.ceveme.infrastructure.external.gemini;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.employmentInfo.EmploymentInfoResponse;
import pl.ceveme.application.dto.gemini.DataContainer;
import pl.ceveme.application.dto.gemini.GeminiRequest;
import pl.ceveme.application.mapper.EmploymentInfoMapper;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.JobOfferRepository;
import pl.ceveme.domain.repositories.UserRepository;

@Service
public class GeminiService {
    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);

    // jest juz w bazie
    // controller z linku

    private final UserRepository userRepository;

    private final JobOfferRepository jobOfferRepository;
    private final GeminiHttpClient fetchAi;
    private final EmploymentInfoMapper mapper;

    public GeminiService(UserRepository userRepository, JobOfferRepository jobOfferRepository, GeminiHttpClient fetchAi, EmploymentInfoMapper mapper) {
        this.userRepository = userRepository;
        this.jobOfferRepository = jobOfferRepository;
        this.fetchAi = fetchAi;
        this.mapper = mapper;
    }



    @Transactional
    public String response(GeminiRequest request) {
        User user = userRepository.findByEmail(new Email(request.email()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        JobOffer offer = jobOfferRepository.findById(request.id())
                .orElseThrow(() -> new IllegalArgumentException("Job offer not found"));
        EmploymentInfo employmentInfo = user.getEmploymentInfo();
        EmploymentInfoResponse response = mapper.toResponse(employmentInfo);

        String prompt = PromptBuilder.createPrompt(new DataContainer(offer,user,response));

        return fetchAi.getResponse(prompt).text();
    }

}
