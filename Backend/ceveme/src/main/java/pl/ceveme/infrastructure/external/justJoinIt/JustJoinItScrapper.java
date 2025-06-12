package pl.ceveme.infrastructure.external.justJoinIt;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.io.IOException;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import pl.ceveme.domain.repositories.JobOfferRepository;
import pl.ceveme.infrastructure.external.HttpClientWrapper;

import java.util.*;


@Component
public class JustJoinItScrapper {
    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
    private static final int REQUEST_DELAY_MS = 1000;

    private final HttpClientWrapper httpClient;
    private final ObjectMapper objectMapper;
    private final JobOfferRepository jobOfferRepository;
    Logger logger = LoggerFactory.getLogger(JustJoinItScrapper.class);

    public JustJoinItScrapper(HttpClientWrapper httpClient, ObjectMapper objectMapper, JobOfferRepository jobOfferRepository) {
        this.httpClient = httpClient;
        this.objectMapper = new ObjectMapper();
        this.jobOfferRepository = jobOfferRepository;
    }



    public List<String> extractUrlsFromPage(String baseUrl) throws IOException {
        try {
            Document doc = Jsoup.connect(baseUrl).userAgent(USER_AGENT).get();
            Elements jobLinks = doc.select("a[class*=offer-card]");
            logger.info("List size {}", jobLinks.size());
            return jobLinks.stream().map(e -> e.attr("href")).map(link -> "justjoinit.it" + link).toList();
        } catch (java.io.IOException e) {
            logger.error("Failed to fetch page: {}", baseUrl, e);
            return Collections.emptyList();
        }
    }
}
