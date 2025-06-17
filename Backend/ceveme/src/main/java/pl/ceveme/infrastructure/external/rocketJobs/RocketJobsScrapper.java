package pl.ceveme.infrastructure.external.rocketJobs;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jsoup.nodes.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.repositories.JobOfferRepository;
import pl.ceveme.infrastructure.external.common.AbstractJobScraper;
import pl.ceveme.infrastructure.external.common.HttpClient;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.StreamSupport;

@Component
public class RocketJobsScrapper extends AbstractJobScraper {

    private static final Logger log = LoggerFactory.getLogger(RocketJobsScrapper.class);
    private static final String API_URL = "https://api.rocketjobs.pl/v2/user-panel/offers?&page=2&sortBy=published&orderBy=DESC&perPage=100";
    private static final String OFFER_URL = "https://rocketjobs.pl/oferta-pracy/";

    public RocketJobsScrapper(HttpClient httpClient, ObjectMapper objectMapper, JobOfferRepository jobOfferRepository) {
        super(httpClient, objectMapper, jobOfferRepository);
    }

    @Override
    protected JobOffer extractJobData(String url) throws Exception {
        Document doc = fetchDocument(url);
        JsonNode json = parseJson(doc, "div[class*=mui-1klyplv]");
        log.info("Extracted data {}", json);
        return RocketJobsMapper.mapToOffer(json);
    }

    public List<JobOffer> createJobs() {
        try {
            int totalPage = totalPageNumber();
            log.info("Total pages Rocket Jobs {}", totalPage);
            List<String> allUrls = new ArrayList<>();
            for (int i = 1; i <= totalPage; i++) {
                log.info("Currnet page Rocket Jobs {}", i);
                JsonNode page = objectMapper.readTree(httpClient.fetchContentJJI(String.format(API_URL,i)));
                extractLinks(page,allUrls);
                delay();
            }
            return processUrls(allUrls);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void extractLinks(JsonNode node, List<String> allUrls) {
              StreamSupport.stream(node.path("data")
                             .spliterator(), false)
                     .map(n -> n.path("slug")
                             .asText(null))
                     .filter(s -> s != null && !s.isBlank())
                     .map(s -> OFFER_URL + s)
                     .forEach(allUrls::add);
         }

    private int totalPageNumber() {
        try {
            JsonNode firstPage = objectMapper.readTree(httpClient.fetchContentJJI(String.format(API_URL,1)));
            return firstPage.path("meta").path("totalPages").asInt();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
