package pl.ceveme.infrastructure.external.common;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.repositories.JobOfferRepository;
import pl.ceveme.infrastructure.external.exception.FetchException;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

public abstract class AbstractJobScraper {
    private static final Logger logger = LoggerFactory.getLogger(AbstractJobScraper.class);
    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
    private static final int REQUEST_DELAY_MS = 1000;
    protected final HttpClient httpClient;
    protected final ObjectMapper objectMapper;
    protected final JobOfferRepository jobOfferRepository;

    public AbstractJobScraper(HttpClient httpClient, ObjectMapper objectMapper, JobOfferRepository jobOfferRepository) {
        this.httpClient = httpClient;
        this.objectMapper = objectMapper;
        this.jobOfferRepository = jobOfferRepository;
    }

    protected Document fetchDocument(String url) {
        try {
            return Jsoup.connect(url)
                    .userAgent(USER_AGENT)
                    .get();
        } catch (IOException e) {
            throw new FetchException("Cannot fetch " + url, e);
        }
    }

    protected void delay() {
        try {
            Thread.sleep(REQUEST_DELAY_MS);
        } catch (InterruptedException ie) {
            Thread.currentThread()
                    .interrupt();
            throw new FetchException("Interrupted", ie);
        }
    }

    protected JsonNode parseJson(Document doc, String cssQuery) {
        Element script = doc.selectFirst(cssQuery);
        if (script == null) {
            throw new FetchException("Schema JSON not found for selector: " + cssQuery);
        }
        try {
            return objectMapper.readTree(script.data());
        } catch (Exception e) {
            throw new FetchException("Invalid JSON", e);
        }
    }

    protected String extractField(Document doc, String labelSelector, String valueSelector, String label) {
        return doc.select(labelSelector)
                .stream()
                .filter(el -> {
                    Element labelElement = el.selectFirst("p.text-gray-400");
                    return labelElement != null && label.equalsIgnoreCase(labelElement.text());
                })
                .map(el -> {
                    Element v = el.selectFirst(valueSelector);
                    return v != null ? v.text().trim() : null;
                })
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);
    }
    protected List<JobOffer> processUrls(List<String> urls) {
        logger.info("All extracted urls {}", urls.size());
        List<String> existing = jobOfferRepository.findAll()
                .stream()
                .map(JobOffer::getLink)
                .toList();


        return urls.stream()
                .filter(Objects::nonNull)
                .peek(url -> {
                    if (existing.contains(url)) {
                        logger.info("Deleted: {}", url);
                    }
                })
                .filter(url -> !existing.contains(url))
                .map(this::safeExtractAndSave)
                .filter(Objects::nonNull)
                .toList();
    }

    protected List<JobOffer> processUrlsNoFluffJobs(List<String> urls) {
        logger.info("All extracted urls NOFLUFF {}", urls.size());
        List<String> existing = jobOfferRepository.findAll()
                .stream()
                .map(JobOffer::getLink)
                .map(e -> {
                    int lastIndex = e.lastIndexOf('-');
                    return e.substring(0, lastIndex);
                })
                .toList();

        existing.stream().forEach(System.out::println);

        
        
        String urlAfterCut = "";        https://nofluffjobs.com/pl/job/professional-services-engineer-mend-io


        return urls.stream()
                .filter(Objects::nonNull)
                .peek(url -> {
                    int lastIndex = url.lastIndexOf('-');
                    urlAfterCut = url.substring(0,lastIndex);
                    if (existing.contains(urlAfterCut)) {
                        logger.info("Deleted from NoFluff: {}", url);
                    }
                })
                .map(e -> {
                    int lastIndex = e.lastIndexOf('-');
                    return e.substring(0, lastIndex);
                })
                .filter(url -> !existing.contains(url))
                .map(this::safeExtractAndSave)
                .filter(Objects::nonNull)
                .toList();
    }

    private JobOffer safeExtractAndSave(String url) {
        try {
            JobOffer o = extractJobData(url);
            delay();
            return jobOfferRepository.save(o);
        } catch (Exception e) {
            logger.warn("Failed to process {}", url, e);
            return null;
        }
    }

    protected abstract JobOffer extractJobData(String url) throws Exception;


}
