package pl.ceveme.infrastructure.external.scrap.justJoinIt;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import pl.ceveme.application.dto.scrap.JobOfferRequest;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.repositories.JobOfferRepository;
import pl.ceveme.infrastructure.external.common.AbstractJobScraper;
import pl.ceveme.infrastructure.external.common.HttpClient;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Component
public class JustJoinItScrapper extends AbstractJobScraper {
    private static final String API_URL = "https://api.justjoin.it/v2/user-panel/offers/by-cursor?from=%d&itemsCount=100&orderBy=DESC&sortBy=published";
    private static final String JOB_URL = "https://justjoin.it/job-offer/";
    private static final Logger log = LoggerFactory.getLogger(JustJoinItScrapper.class);

    public JustJoinItScrapper(HttpClient httpClient, ObjectMapper objectMapper, JobOfferRepository jobOfferRepository) {
        super(httpClient, objectMapper, jobOfferRepository);
    }

    public List<JobOffer> createJobs() {
        try {
            List<String> allUrls = new ArrayList<>();
            int currentCursor = 0;
            boolean hasNext = true;

            log.info("Starting JustJoinIt scraping with cursor pagination...");

            while (hasNext) {
                log.info("Fetching data from cursor: {}", currentCursor);
                String response = httpClient.fetchContentJJI(String.format(API_URL, currentCursor));
                JsonNode root = objectMapper.readTree(response);

                extractLinks(root, allUrls);

                JsonNode nextNode = root.path("meta").path("next");

                if (!nextNode.isMissingNode() && nextNode.has("cursor") && !nextNode.get("cursor").isNull()) {
                    int nextCursor = nextNode.path("cursor").asInt();

                    if (nextCursor > currentCursor) {
                        currentCursor = nextCursor;
                        delay();
                    } else {
                        log.info("Loop detected (next cursor: {}). stop wtedy:.", nextCursor);
                        hasNext = false;
                    }
                } else {
                    hasNext = false;
                    log.info("No more pages.");
                }
            }

            return processUrls(allUrls);
        } catch (Exception e) {
            log.error("Scraping failed", e);
            throw new RuntimeException(e);
        }
    }

    private void extractLinks(JsonNode node, List<String> allUrls) {
        StreamSupport.stream(node.path("data").spliterator(),
                false).map(n -> n.path("slug").asText(null)).filter(s -> s != null && !s.isBlank()).map(s -> JOB_URL + s).forEach(
                allUrls::add);
    }

    public JobOfferRequest getJobDetails(String url) {
        JobOffer jobOffer = extractJobData(url);
        return new JobOfferRequest(jobOffer.getTitle(),
                jobOffer.getCompany(),
                jobOffer.getRequirements(),
                jobOffer.getNiceToHave(),
                jobOffer.getResponsibilities(),
                jobOffer.getExperienceLevel(),
                jobOffer.getSalary(),
                jobOffer.getLocation(),
                jobOffer.getBenefits(),
                jobOffer.getEmploymentType(),
                jobOffer.getDateAdded(),
                jobOffer.getDateEnding(),
                "Scrap successful");
    }

    @Override
    protected JobOffer extractJobData(String link) {
        Document doc = fetchDocument(link);
        JsonNode json = parseJson(doc, "div[class*=mui-1govsol]");

        String tech = doc.select("h4[class*=MuiTypography-subtitle2]").stream().map(Element::text).filter(t -> !t.isBlank()).distinct().collect(
                Collectors.joining(", "));

        String exp = extractExperienceLevel(doc);

        log.info("Data extracted from {} ", link);
        return JobOfferJustJoinItMapper.mapToOffer(json, link, tech, exp);
    }

    private String extractExperienceLevel(Document doc) {
        return doc.select(
                "div:contains(Senior), div:contains(Mid), div:contains(Junior), div:contains(Manager / C-level)").stream().map(
                Element::text).filter(text -> text.equalsIgnoreCase("Junior") || text.equalsIgnoreCase("Mid") || text.equalsIgnoreCase(
                "Senior") || text.equalsIgnoreCase("Manager / C-level")).findFirst().orElse(null);
    }
}