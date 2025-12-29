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
import java.util.Random;

@Component
public class PracujPlScrapper extends AbstractJobScraper {
    private static final Logger log = LoggerFactory.getLogger(PracujPlScrapper.class);
    private static final String BASE_URL = "https://www.pracuj.pl/praca?pn=";

    public PracujPlScrapper(HttpClient httpClient, ObjectMapper objectMapper, JobOfferRepository jobOfferRepository) {
        super(httpClient, objectMapper, jobOfferRepository);
    }

    public List<JobOffer> createJobs() throws IOException {
        List<String> urls = extractJobUrls();
        return processUrls(urls);
    }

    public JobOfferRequest getJobDetails(String url) throws Exception {
        JobOffer jobOffer = extractJobData(url);
        if (jobOffer == null) return null;

        return new JobOfferRequest(
                jobOffer.getTitle(), jobOffer.getCompany(), jobOffer.getRequirements(),
                jobOffer.getNiceToHave(), jobOffer.getResponsibilities(), jobOffer.getExperienceLevel(),
                jobOffer.getSalary(), jobOffer.getLocation(), jobOffer.getBenefits(),
                jobOffer.getEmploymentType(), jobOffer.getDateAdded(), jobOffer.getDateEnding(),
                "Scrap successful"
        );
    }

    private List<String> extractJobUrls() {
        List<String> all = new ArrayList<>();
        for (int p = 1; p <= 15; p++) {
            String url = BASE_URL + p;
            log.info("Fetching list page: {}", url);
            try {
                String html = httpClient.fetchContentWithBrowser(url);
                Document doc = Jsoup.parse(html);

                Elements links = doc.select("a[class*=tiles_cnb3rfy]");
                if (links.isEmpty()) {
                    log.warn("No links found on page {}. Possible Cloudflare block.", p);
                }

                links.forEach(e -> {
                    String href = e.attr("href");
                    if (href != null && !href.isBlank()) {
                        all.add(href);
                    }
                });

                Thread.sleep(1000 + new Random().nextInt(1000));
            } catch (Exception e) {
                log.error("Failed to fetch URLs from page {}: {}", p, e.getMessage());
            }
        }
        return all.stream().distinct().toList();
    }

    @Override
    protected JobOffer extractJobData(String url) throws Exception {
        log.info("Fetching job details from: {}", url);

        String html = httpClient.fetchContentWithBrowser(url);
        Document doc = Jsoup.parse(html);

        if (doc.title().contains("Just a moment") || html.contains("challenges.cloudflare.com")) {
            log.error("Cloudflare Turnstile detected on: {}", url);
            return null;
        }

        Element script = doc.selectFirst("script#job-schema-org[type=application/ld+json]");

        if (script == null) {
            log.warn("JSON data not found for offer: {}", url);
            return null;
        }

        try {
            JsonNode json = objectMapper.readTree(script.dataNodes().get(0).getWholeData());
            Element expWrapper = doc.selectFirst("li[data-test='sections-benefit-employment-type-name'] [data-test='offer-badge-title']");
            String experience = (expWrapper != null) ? expWrapper.text() : null;

            log.info("Successfully extracted data for: {}", url);

            return JobOfferPracujPlMapper.mapToJobOffer(json, url, experience);

        } catch (Exception e) {
            log.error("Error parsing JSON for {}: {}", url, e.getMessage());
            return null;
        }
    }
}