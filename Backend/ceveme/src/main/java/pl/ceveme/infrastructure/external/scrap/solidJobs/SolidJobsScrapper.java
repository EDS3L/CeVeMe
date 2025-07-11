package pl.ceveme.infrastructure.external.scrap.solidJobs;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.hc.core5.http.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.scrap.JobOfferRequest;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.repositories.JobOfferRepository;
import pl.ceveme.infrastructure.external.common.AbstractJobScraper;
import pl.ceveme.infrastructure.external.common.HttpClient;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

@Service
public class SolidJobsScrapper extends AbstractJobScraper {

    private static final Logger log = LoggerFactory.getLogger(SolidJobsScrapper.class);
    private static final String BASE_API_URL = "https://solid.jobs/api/offers";
    private static final String API_ENDPOINT = BASE_API_URL + "?division=it&sortOrder=default";

    public SolidJobsScrapper(HttpClient httpClient, ObjectMapper objectMapper, JobOfferRepository jobOfferRepository) {
        super(httpClient, objectMapper, jobOfferRepository);
    }


    public List<JobOffer> createJobs() {
        try {
            List<String> jobOfferUrls = fetchJobOfferLinks();
            return processUrls(jobOfferUrls);
        } catch (Exception e) {
            log.error("Failed to fetch job offers from SolidJobs", e);
            return Collections.emptyList();
        }
    }

    public JobOfferRequest getJobDetails(String url) throws Exception {
        String finalUrl = url.replaceAll("https://solid.jobs/offer/", BASE_API_URL + "/");
        JobOffer jobOffer = extractJobData(finalUrl);
        return new JobOfferRequest(jobOffer.getTitle(), jobOffer.getCompany(), jobOffer.getRequirements(), jobOffer.getCompany(), jobOffer.getResponsibilities(), jobOffer.getExperienceLevel(), "Scrap successful");
    }

    private List<String> fetchJobOfferLinks() throws IOException, ParseException {
        try {
            String response = httpClient.fetchContentSolidJobs(API_ENDPOINT);
            return parseJobOfferUrls(response);
        } catch (IOException | ParseException e) {
            log.error("Failed to fetch job offers list from API: {}", e.getMessage());
            throw e;
        }
    }


    private List<String> parseJobOfferUrls(String jsonResponse) throws IOException {
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);

            if (!root.isArray()) {
                log.warn("Unexpected API response structure - expected array");
                return Collections.emptyList();
            }

            return StreamSupport.stream(root.spliterator(), false)
                    .map(this::extractJobOfferUrl)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .distinct()
                    .toList();

        } catch (IOException e) {
            log.error("Failed to parse JSON response: {}", e.getMessage());
            throw e;
        }
    }


    private Optional<String> extractJobOfferUrl(JsonNode jobNode) {
        try {
            JsonNode idNode = jobNode.get("id");
            JsonNode urlNode = jobNode.get("jobOfferUrl");

            if (idNode == null || urlNode == null) {
                log.warn("Missing required fields in API response: id or jobOfferUrl");
                return Optional.empty();
            }

            String id = idNode.asText();
            String jobOfferUrl = urlNode.asText();

            if (id.isEmpty() || jobOfferUrl.isEmpty()) {
                log.warn("Empty values in id or jobOfferUrl fields");
                return Optional.empty();
            }

            return Optional.of(buildJobOfferUrl(id, jobOfferUrl));

        } catch (Exception e) {
            log.warn("Failed to extract job offer URL: {}", e.getMessage());
            return Optional.empty();
        }
    }


    private String buildJobOfferUrl(String id, String jobOfferUrl) {
        return BASE_API_URL + "/" + id + "/" + jobOfferUrl;
    }


    @Override
    protected JobOffer extractJobData(String url) throws Exception {
        log.info("Fetching job offer details from: {}", url);

        try {
            String response = httpClient.fetchJobOfferFromSolidJobs(url);
            JsonNode root = objectMapper.readTree(response);

            return SolidJobsMapper.mapToJobOffer(root);

        } catch (IOException e) {
            log.error("Failed to fetch job offer from URL {}: {}", url, e.getMessage());
            throw new Exception("Unable to fetch job offer data", e);
        } catch (Exception e) {
            log.error("Failed to process job offer from URL {}: {}", url, e.getMessage());
            throw e;
        }
    }
}