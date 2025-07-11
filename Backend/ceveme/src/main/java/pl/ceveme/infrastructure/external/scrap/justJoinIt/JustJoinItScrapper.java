package pl.ceveme.infrastructure.external.scrap.justJoinIt;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.hc.core5.http.ParseException;
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

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;


@Component
public class JustJoinItScrapper extends AbstractJobScraper {
    private static final String API_URL = "https://api.justjoin.it/v2/user-panel/offers?page=%d&sortBy=published&orderBy=DESC&perPage=100";
    private static final String JOB_URL = "https://justjoin.it/job-offer/";
    private static final Logger log = LoggerFactory.getLogger(JustJoinItScrapper.class);

    public JustJoinItScrapper(HttpClient httpClient, ObjectMapper objectMapper, JobOfferRepository jobOfferRepository) {
        super(httpClient, objectMapper, jobOfferRepository);
    }

    public List<JobOffer> createJobs() {
        try {
            int pages = totalPageNumber();
            log.info("Total pages {}", pages);
            List<String> all = new ArrayList<>();
            for (int p = 1; p <= pages; p++) {
                log.info("Currnet page {}", p);
                JsonNode page = objectMapper.readTree(httpClient.fetchContentJJI(String.format(API_URL, p)));
                extractLinks(page, all);
                delay();
            }
            return processUrls(all);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private void extractLinks(JsonNode node, List<String> allUrls) {
        StreamSupport.stream(node.path("data")
                        .spliterator(), false)
                .map(n -> n.path("slug")
                        .asText(null))
                .filter(s -> s != null && !s.isBlank())
                .map(s -> JOB_URL + s)
                .forEach(allUrls::add);
    }

    public JobOfferRequest getJobDetails(String url) {
        JobOffer jobOffer = extractJobData(url);
        return new JobOfferRequest(jobOffer.getTitle(), jobOffer.getCompany(), jobOffer.getRequirements(), jobOffer.getCompany(), jobOffer.getResponsibilities(), jobOffer.getExperienceLevel(), "Scrap successful");
    }

    @Override
    protected JobOffer extractJobData(String link) {
        Document doc = fetchDocument(link);
        JsonNode json = parseJson(doc, "div[class*=mui-jmaby8]");

        String tech = doc.select("h4[class*=MuiTypography-subtitle2]")
                .stream()
                .map(Element::text)
                .filter(t -> !t.isBlank())
                .distinct()
                .collect(Collectors.joining(", "));

        String exp = extractSection(doc, "Experience");
        String empType = extractSection(doc, "Employment Type");
        String salary = Optional.ofNullable(doc.selectFirst("div[class*=mui-1km0bek]"))
                .map(w -> w.child(0)
                        .text())
                .orElse(null);

        log.info("Data extracted {} from {} ", json, link);
        return JobOfferJustJoinItMapper.mapToOffer(json, link, tech, exp, salary, empType);
    }

    private String extractSection(Document doc, String label) {
        return doc.select("div.MuiBox-root.mui-c76cah")
                .stream()
                .filter(sec -> label.equalsIgnoreCase(Optional.ofNullable(sec.selectFirst("div.MuiBox-root.mui-yqsicd"))
                        .map(Element::text)
                        .orElse("")))
                .map(sec -> sec.selectFirst("div.MuiBox-root.mui-1ihbss1")
                        .text())
                .findFirst()
                .orElse(null);
    }

    private int totalPageNumber() {
        try {
            JsonNode first = objectMapper.readTree(httpClient.fetchContentJJI(String.format(API_URL, 1)));
            return first.path("meta")
                    .path("totalPages")
                    .asInt();
        } catch (IOException | ParseException e) {
            throw new RuntimeException(e);
        }

    }
}
