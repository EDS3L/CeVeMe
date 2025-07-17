package pl.ceveme.infrastructure.external.gemini;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.employmentInfo.EmploymentInfoResponse;
import pl.ceveme.application.dto.gemini.DataContainer;
import pl.ceveme.application.dto.gemini.DataLinkContainer;
import pl.ceveme.application.dto.gemini.GeminiExistOfferRequest;
import pl.ceveme.application.dto.gemini.GeminiLinkRequest;
import pl.ceveme.application.dto.scrap.JobOfferRequest;
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

    private final UserRepository userRepository;
    private final ScrapChooser scrapChooser;
    private final JobOfferRepository jobOfferRepository;
    private final GeminiHttpClient fetchAi;
    private final EmploymentInfoMapper mapper;
    private final ObjectMapper objectMapper;


    public GeminiService(UserRepository userRepository, ScrapChooser scrapChooser, JobOfferRepository jobOfferRepository, GeminiHttpClient fetchAi, EmploymentInfoMapper mapper, ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.scrapChooser = scrapChooser;
        this.jobOfferRepository = jobOfferRepository;
        this.fetchAi = fetchAi;
        this.mapper = mapper;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public String responseByExistOffer(GeminiExistOfferRequest request) throws JsonProcessingException {
        User user = userRepository.findByEmail(new Email(request.email()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        JobOffer offer = jobOfferRepository.findById(request.id())
                .orElseThrow(() -> new IllegalArgumentException("Job offer not found"));
        EmploymentInfo employmentInfo = user.getEmploymentInfo();
        EmploymentInfoResponse response = mapper.toResponse(employmentInfo);

        String prompt = PromptBuilder.createPrompt(new DataContainer(offer,user,response));
        log.info("resul {}", fetchAi.getResponse(prompt).text());
        JsonNode node = objectMapper.readTree(fetchAi.getResponse(prompt).text());

        log.info("node {}", node);
        return fetchAi.getResponse(prompt).text();
    }

    @Transactional
    public String responseByLink(GeminiLinkRequest request) throws Exception {
        User user = userRepository.findByEmail(new Email(request.email()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        EmploymentInfo employmentInfo = user.getEmploymentInfo();

        EmploymentInfoResponse response = mapper.toResponse(employmentInfo);

        JobOfferRequest offer = scrapChooser.chooseCorrectPortal(request.link());
        log.info("offer {}", offer.toString());
        String prompt = PromptBuilder.createPrompt(new DataLinkContainer(offer,user,response));

        return fetchAi.getResponse(prompt).text();
    }

}
