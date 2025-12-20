package pl.ceveme.infrastructure.external.scrap.pracujPl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microsoft.playwright.*;
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
import java.nio.file.Paths;
import java.util.*;

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
        log.info("Getting job offer: {}", jobOffer);
        return new JobOfferRequest(
                jobOffer.getTitle(),
                jobOffer.getCompany(),
                jobOffer.getRequirements(),
                jobOffer.getCompany(),
                jobOffer.getResponsibilities(),
                jobOffer.getExperienceLevel(),
                jobOffer.getSalary(),
                jobOffer.getLocation(),
                jobOffer.getBenefits(),
                jobOffer.getEmploymentType(),
                jobOffer.getDateAdded(),
                jobOffer.getDateEnding(),
                "Scrap successful"
        );
    }

    private List<String> extractJobUrls() throws IOException {
        List<String> all = new ArrayList<>();
        String BASE_URL = "https://www.pracuj.pl/praca";
        int max = extractPageNumber(BASE_URL);
        log.info("Total page on Pracuj Pl {}", max);

        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(true));
            BrowserContext context = browser.newContext(new Browser.NewContextOptions()
                    .setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"));

            Page page = context.newPage();

            for (int p = 1; p <= 5; p++) {
                String url = p == 1 ? BASE_URL : BASE_URL + "?" + "pn=" + p;
                log.info("Current page: {}, on url {}", p, url);

                page.navigate(url);
                page.waitForTimeout(1000);

                String content = page.content();
                Document doc = Jsoup.parse(content);
                log.info("currect doc {}", doc);

                Elements links = doc.select("a[class*=tiles_cnb3rfy]");
                links.forEach(e -> {
                    String href = e.attr("href");
                    if (!href.isBlank()) all.add(href);
                });


            }
        }
        return all;
    }

    @Override
    protected JobOffer extractJobData(String url) throws Exception {
        log.info("Fetching with Playwright: {}", url);
        String raw = fetchContentWithPlaywright(url);
        Document doc = Jsoup.parse(raw);
        Element script = doc.selectFirst("script#job-schema-org[type=application/ld+json]");

        if (doc.title().contains("Just a moment") || doc.title().contains("Cloudflare")) {
            log.error("CLOUDFLARE BLOCKED REQUEST: {}", url);
            throw new IOException("Cloudflare challenge detected");
        }

        log.info("Job Schema org found: {}", script != null);
        if (script == null) return null;

        JsonNode json = objectMapper.readTree(script.dataNodes()
                .getFirst()
                .getWholeData());

        Element wrapper = doc.selectFirst("li[data-test*=sections-benefit-employment-type-name] div[class*=tchzayo]");
        String experience = (wrapper != null && !wrapper.text().isBlank()) ? wrapper.text() : null;

        log.info("Data extracted successfully from {}", url);

        return JobOfferPracujPlMapper.mapToJobOffer(json, url, experience);
    }

    private int extractPageNumber(String pageUrl) throws IOException {
        String content = fetchContentWithPlaywright(pageUrl);
        Document doc = Jsoup.parse(content);

        Elements btn = doc.select("button[class*=listing_n19df7xb]");
        if (btn.isEmpty()) {
            return 1;
        }
        return Integer.parseInt(Objects.requireNonNull(btn.last()).text());
    }

    private String fetchContentWithPlaywright(String url) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(true));

            BrowserContext context = browser.newContext(new Browser.NewContextOptions()
                    .setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"));

            Page page = context.newPage();
            page.navigate(url);

            try {
                page.waitForSelector("script#job-schema-org", new Page.WaitForSelectorOptions().setTimeout(5000));
            } catch (Exception e) {
                log.warn("Timeout waiting for selector, returning content anyway. URL: {}", url);
            }

            return page.content();
        }
    }
}