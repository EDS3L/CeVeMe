package pl.ceveme.infrastructure.external.gemini;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.employmentInfo.EmploymentInfoResponse;
import pl.ceveme.application.dto.gemini.*;
import pl.ceveme.application.dto.scrap.JobOfferRequest;
import pl.ceveme.application.mapper.EmploymentInfoMapper;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.JobOfferRepository;
import pl.ceveme.domain.repositories.UserRepository;

@Service
public class GeminiService implements GeminiMapper {
    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);

    private final UserRepository userRepository;
    private final ScrapChooser scrapChooser;
    private final GeminiHttpClient fetchAi;
    private final EmploymentInfoMapper mapper;
    private final ObjectMapper objectMapper;

    public GeminiService(UserRepository userRepository, ScrapChooser scrapChooser, GeminiHttpClient fetchAi, EmploymentInfoMapper mapper, ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.scrapChooser = scrapChooser;
        this.fetchAi = fetchAi;
        this.mapper = mapper;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public GeminiResponse responseByLink(GeminiLinkRequest request) throws Exception {
        User user = userRepository.findByEmail(new Email(request.email()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        EmploymentInfo employmentInfo = user.getEmploymentInfo();

        EmploymentInfoResponse response = mapper.toResponse(employmentInfo);

        JobOfferRequest offer = scrapChooser.chooseCorrectPortal(request.link());

        String prompt = PromptBuilder.createPrompt(new DataLinkContainer(offer, user, response));
        String aiResponse = fetchAi.getResponse(prompt).text();
        log.info("cleanded JSON {}", aiResponse);

        String cleanedJson = cleanJsonResponse(aiResponse);



        try {
            return objectMapper.readValue(cleanedJson, GeminiResponse.class);
        } catch (JsonProcessingException e) {
            return parseJson(cleanedJson, objectMapper);
        }
    }


}
