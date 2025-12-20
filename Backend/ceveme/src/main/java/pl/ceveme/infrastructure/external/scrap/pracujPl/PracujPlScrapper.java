package pl.ceveme.infrastructure.external.scrap.pracujPl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microsoft.playwright.*;
import com.microsoft.playwright.options.WaitUntilState;
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

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class PracujPlScrapper extends AbstractJobScraper {
    private static final Logger log = LoggerFactory.getLogger(PracujPlScrapper.class);
    private static final Random random = new Random();

    public PracujPlScrapper(HttpClient httpClient, ObjectMapper objectMapper, JobOfferRepository jobOfferRepository) {
        super(httpClient, objectMapper, jobOfferRepository);
    }

    public JobOfferRequest getJobDetails(String url) throws Exception {
        try (Playwright playwright = Playwright.create()) {
            try (BrowserContext context = createStealthContext(playwright)) {
                Page page = context.newPage();
                JobOffer jobOffer = scrapeSingleJob(page, url);

                if (jobOffer == null) throw new RuntimeException("Scrap failed for: " + url);

                return new JobOfferRequest(
                        jobOffer.getTitle(), jobOffer.getCompany(), jobOffer.getRequirements(),
                        jobOffer.getCompany(), jobOffer.getResponsibilities(), jobOffer.getExperienceLevel(),
                        jobOffer.getSalary(), jobOffer.getLocation(), jobOffer.getBenefits(),
                        jobOffer.getEmploymentType(), jobOffer.getDateAdded(), jobOffer.getDateEnding(),
                        "Scrap successful"
                );
            }
        }
    }

    public List<JobOffer> createJobs() {
        List<JobOffer> allJobs = new ArrayList<>();
        try (Playwright playwright = Playwright.create()) {
            try (BrowserContext context = createStealthContext(playwright)) {
                Page page = context.newPage();
                List<String> urls = extractJobUrls(page);
                for (String url : urls) {
                    try {
                        JobOffer jo = scrapeSingleJob(page, url);
                        if (jo != null) allJobs.add(jo);
                        randomHumanDelay(3000, 6000);
                    } catch (Exception e) {
                        log.error("Error scraping {}: {}", url, e.getMessage());
                    }
                }
            }
        }
        return allJobs;
    }

    private JobOffer scrapeSingleJob(Page page, String url) throws Exception {
        page.navigate(url, new Page.NavigateOptions().setWaitUntil(WaitUntilState.NETWORKIDLE));
        handleCloudflare(page);

        // Dodatkowe czekanie na JSON-LD
        page.waitForTimeout(2000);

        Document doc = Jsoup.parse(page.content());
        Element script = doc.selectFirst("script#job-schema-org");
        if (script == null) return null;

        JsonNode json = objectMapper.readTree(script.dataNodes().get(0).getWholeData());
        Element wrapper = doc.selectFirst("li[data-test*=sections-benefit-employment-type-name] div[class*=tchzayo]");
        String experience = (wrapper != null) ? wrapper.text() : "";

        return JobOfferPracujPlMapper.mapToJobOffer(json, url, experience);
    }

    private List<String> extractJobUrls(Page page) {
        List<String> urls = new ArrayList<>();
        page.navigate("https://www.pracuj.pl/praca");
        handleCloudflare(page);

        Document doc = Jsoup.parse(page.content());
        doc.select("a[class*=tiles_cnb3rfy]").forEach(e -> {
            String href = e.attr("href");
            if (!href.isBlank()) urls.add(href.startsWith("http") ? href : "https://www.pracuj.pl" + href);
        });
        return urls;
    }

    private BrowserContext createStealthContext(Playwright playwright) {
        // Tryb HEADLESS (true) dla serwerów/Dockerów
        BrowserType.LaunchPersistentContextOptions options = new BrowserType.LaunchPersistentContextOptions()
                .setHeadless(true)
                .setArgs(List.of(
                        "--disable-blink-features=AutomationControlled",
                        "--no-sandbox",
                        "--disable-setuid-sandbox",
                        "--use-gl=desktop" // Pomaga omijać niektóre testy GPU bota
                ))
                .setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36");

        BrowserContext context = playwright.chromium().launchPersistentContext(Paths.get("/tmp/user_data_pracuj"), options);

        // Wstrzykiwanie skryptu ukrywającego Playwrighta nawet w headless
        context.addInitScript("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})");

        return context;
    }

    private void handleCloudflare(Page page) {
        if (page.title().toLowerCase().contains("just a moment") || page.content().contains("verifying you are human")) {
            log.warn("Cloudflare detected! Waiting longer...");
            page.waitForTimeout(10000);
        }
    }

    private void randomHumanDelay(int min, int max) {
        try { Thread.sleep(random.nextInt(max - min) + min); } catch (Exception ignored) {}
    }

    @Override
    protected JobOffer extractJobData(String url) throws Exception {
        try (Playwright playwright = Playwright.create()) {
            try (BrowserContext context = createStealthContext(playwright)) {
                return scrapeSingleJob(context.newPage(), url);
            }
        }
    }
}