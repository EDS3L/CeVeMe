// pl/ceveme/infrastructure/external/pracujPl/PracujPlScrapper.java
package pl.ceveme.infrastructure.external.scrap.pracujPl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
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

@Component
public class PracujPlScrapper extends AbstractJobScraper {
    private static final Logger log = LoggerFactory.getLogger(PracujPlScrapper.class);

    public PracujPlScrapper(HttpClient httpClient, ObjectMapper objectMapper, JobOfferRepository jobOfferRepository) {
        super(httpClient, objectMapper, jobOfferRepository);
    }

    public List<JobOffer> createJobs() throws IOException {
        List<String> urls = extractJobUrls();
        return processUrls(urls);
    }
    public JobOfferRequest getJobDetails(String url) throws Exception {
        JobOffer jobOffer = extractJobData(url);
        return new JobOfferRequest(jobOffer.getTitle(), jobOffer.getCompany(), jobOffer.getRequirements(), jobOffer.getCompany(), jobOffer.getResponsibilities(), jobOffer.getExperienceLevel(),jobOffer.getSalary(),jobOffer.getLocation(),jobOffer.getBenefits(),jobOffer.getEmploymentType(),jobOffer.getDateAdded(),jobOffer.getDateEnding(), "Scrap successful");
    }

    private List<String> extractJobUrls() throws IOException {
        List<String> all = new ArrayList<>();
        String BASE_URL = "https://www.pracuj.pl/praca/ostatnich%2024h;p,1";
//        String BASE_URL = "https://www.pracuj.pl/praca/ostatnich%2024h;p,1?et=19"; 3 trony na test
        int max = extractPageNumber(BASE_URL);
        log.info("Total page on Pracuj Pl {}", max);
        for (int p = 1; p <= max; p++) {
            String url = p == 1 ? BASE_URL : BASE_URL + "?" + "pn=" + p;
            log.info("Current page: {}", p);
            Document doc = fetchDocument(url);
            Elements links = doc.select("a[class*=tiles_cnb3rfy]");
            links.forEach(e -> {
                String href = e.attr("href");
                if (!href.isBlank()) all.add(href);
            });
            delay();
        }
        return all;
    }

    @Override
    protected JobOffer extractJobData(String url) throws Exception {
        String raw = httpClient.fetchContent(url);
        Document doc = Jsoup.parse(raw);
        Element script = doc.selectFirst("script#job-schema-org[type=application/ld+json]");
        if (script == null) return null;

        JsonNode json = objectMapper.readTree(script.dataNodes()
                .getFirst()
                .getWholeData());
        Element wrapper = doc.selectFirst("li[data-test*=sections-benefit-employment-type-name] div[class*=tchzayo]");
        String experience = (wrapper != null && !wrapper.text()
                .isBlank()) ? wrapper.text() : null;
        log.info("Data extracted {} from {}", json, url);

        return JobOfferPracujPlMapper.mapToJobOffer(json, url, experience);
    }

    private int extractPageNumber(String pageUrl) throws IOException {
        Document doc = fetchDocument(pageUrl);
        Elements btn = doc.select("button[class*=listing_n19df7xb]");
        return Integer.parseInt(Objects.requireNonNull(btn.last())
                .text());
    }
}
