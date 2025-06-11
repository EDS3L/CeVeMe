package pl.ceveme.infrastructure.external;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.io.IOException;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Component
public class PracujPlScrapper {
    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
    private static final int REQUEST_DELAY_MS = 1000;
//    private final HttpClientWrapper httpClient;
    private final ObjectMapper objectMapper;
    Logger logger = LoggerFactory.getLogger(PracujPlScrapper.class);

    public PracujPlScrapper(ObjectMapper objectMapper) {
//        this.httpClient = httpClient;
        this.objectMapper = new ObjectMapper();
    }

    public List<String> extractJobUrls(String baseUrl) throws IOException {
        List<String> allUrls = new ArrayList<>();
        int maxPages = extractPageNumber(baseUrl);

        for (int page = 1; page < maxPages; page++) {
            try {
                String pageUrl = buildPageUrl(baseUrl,page);
                List<String> pageUrls = extractUrlsFromPage(pageUrl);
                allUrls.addAll(pageUrls);

                logger.info("Extracted {} URLs from page {}", pageUrls.size(), page);
                Thread.sleep(REQUEST_DELAY_MS);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Scraping interrupted", e);
            } catch (Exception e) {
                logger.warn("Failed to scrap page {}: {}", page, e.getMessage());
            }
        }
        return allUrls;
    }

    private String buildPageUrl(String baseUrl, int pageNumber) {
        if (pageNumber == 1) {
            return baseUrl;
        }
        return baseUrl + (baseUrl.contains("?") ? "&" : "?") + "pn=" + pageNumber;
    }

    private List<String> extractUrlsFromPage(String pageUrl) throws IOException {
        try {
            Document doc = Jsoup.connect(pageUrl).userAgent(USER_AGENT).get();
            Elements jobLinks = doc.select("a[class*=tiles_cnb3rfy]");

            return jobLinks.stream().map(element -> element.attr("href")).filter(href -> !href.isEmpty()).toList();

        } catch (IOException | java.io.IOException e) {
            logger.error("Failed to fetch page: {}", pageUrl, e);
            return Collections.emptyList();
        }
    }

    private int extractPageNumber(String pageUrl) throws IOException {
        try {
            Document doc = Jsoup.connect(pageUrl).userAgent(USER_AGENT).get();
            Elements el = doc.select("button[class*=listing_n19df7xb]");

            return Integer.parseInt(Objects.requireNonNull(el.last()).text());

        } catch (IOException e) {
            logger.error("Failed to fetch number of page: {}", pageUrl, e);
            return 0;
        } catch (java.io.IOException e) {
            throw new RuntimeException(e);
        }
    }

}
