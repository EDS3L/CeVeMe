package pl.ceveme.infrastructure.external.scrap.bulldogJob;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jsoup.Jsoup;
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
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.stream.IntStream;
import java.util.stream.StreamSupport;

@Component
public class BulldogJobScrapper extends AbstractJobScraper {
    private static final String BASE_URL = "https://bulldogjob.com/companies/jobs";
    private static final Logger log = LoggerFactory.getLogger(BulldogJobScrapper.class);

    public BulldogJobScrapper(HttpClient httpClient,
                              ObjectMapper objectMapper,
                              JobOfferRepository jobOfferRepository) {
        super(httpClient, objectMapper, jobOfferRepository);
    }

    public List<JobOffer> createJobs() throws IOException {
        List<String> urls = fetchAllJobLinks();
        return processUrls(urls);
    }

    public JobOfferRequest getJobDetails(String url) throws Exception {
        JobOffer jobOffer = extractJobData(url);
        return new JobOfferRequest(jobOffer.getTitle(), jobOffer.getCompany(), jobOffer.getRequirements(), jobOffer.getCompany(), jobOffer.getResponsibilities(), jobOffer.getExperienceLevel(), "Scrap successful");
    }

    private List<String> fetchAllJobLinks() throws IOException {
        JsonNode first = fetchPageJson(BASE_URL);
        int totalPages = calculateTotalPages(first);
        log.info("Total page {}", totalPages);
        List<String> all = new ArrayList<>(parseJobLinks(first));
        IntStream.rangeClosed(2, totalPages).forEach(p -> {
            try {
                log.info("Currnet page {}", p);
                TimeUnit.MILLISECONDS.sleep(1000);
                JsonNode page = fetchPageJson(BASE_URL + "/s/page," + p);
                all.addAll(parseJobLinks(page));
            } catch (Exception e) {
                log.warn("Failed add jobs to list {}", e.getMessage());
            }
        });
        return all.stream().distinct().toList();
    }

    private JsonNode fetchPageJson(String url) throws IOException {
        String html = httpClient.fetchContent(url);
        Document doc = Jsoup.parse(html, url);
        Element script = doc.selectFirst("script[id*=__NEXT_DATA__]");
        if (script == null) throw new IOException("No __NEXT_DATA__ on " + url);
        return objectMapper.readTree(script.dataNodes().getFirst().getWholeData());
    }

    private int calculateTotalPages(JsonNode node) {
        JsonNode slugState = node.path("props").path("pageProps").path("slugState");
        int perPage = slugState.path("perPage").asInt();
        int total   = node.path("props").path("pageProps").path("totalCount").asInt();
        return (int)Math.ceil((double) total / perPage);
    }

    private List<String> parseJobLinks(JsonNode node) {
        return StreamSupport.stream(
                        node.path("props").path("pageProps").path("jobs").spliterator(), false)
                .map(j -> j.path("id").asText(null))
                .filter(Objects::nonNull)
                .map(id -> BASE_URL + "/" + id)
                .toList();
    }

    @Override
    protected JobOffer extractJobData(String link) throws Exception {
        String html = httpClient.fetchContent(link);
        Document doc = Jsoup.parse(html, link);

        JsonNode data = parseJson(doc, "script[type=application/ld+json]");

        String exp = extractField(doc,
                "div.flex.mt-6:has(p.text-gray-400)",
                "p:not(.text-gray-400)",
                "Experience");
        if (exp == null) {
            exp = extractField(doc,
                    "div.flex.mt-6:has(p.text-gray-400)",
                    "p:not(.text-gray-400)",
                    "Doświadczenie");
        }

        String contract = extractField(doc,
                "div.flex.mt-6:has(p.text-gray-400)",
                "p:not(.text-gray-400)",
                "Contract type");
        if (contract == null) {
            contract = extractField(doc,
                    "div.flex.mt-6:has(p.text-gray-400)",
                    "p:not(.text-gray-400)",
                    "Rodzaj umowy");
        }

        log.info("Extracted data {} from {}",data,link);

        return JobOfferBulldogJobMapper.mapToJobOffer(data, link, contract, exp);
    }
}
