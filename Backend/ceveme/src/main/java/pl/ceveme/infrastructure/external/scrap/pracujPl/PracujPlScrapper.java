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
import java.util.Map;
import java.util.Random;

@Component
public class PracujPlScrapper extends AbstractJobScraper {
    private static final Logger log = LoggerFactory.getLogger(PracujPlScrapper.class);
    private static final Random random = new Random();

    public PracujPlScrapper(HttpClient httpClient, ObjectMapper objectMapper, JobOfferRepository jobOfferRepository) {
        super(httpClient, objectMapper, jobOfferRepository);
    }

    public JobOfferRequest getJobDetails(String url) throws Exception {
        log.info("Request for job details: {}", url);
        try (Playwright playwright = Playwright.create()) {
            try (BrowserContext context = createStealthContext(playwright)) {
                Page page = context.newPage();
                JobOffer jobOffer = scrapeSingleJob(page, url);

                if (jobOffer == null) {
                    throw new RuntimeException("Scraping failed - possible Cloudflare block for: " + url);
                }

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
        log.info("Starting mass scraping process...");
        List<JobOffer> allJobs = new ArrayList<>();
        try (Playwright playwright = Playwright.create()) {
            try (BrowserContext context = createStealthContext(playwright)) {
                Page page = context.newPage();
                List<String> urls = extractJobUrls(page);
                log.info("Found {} URLs to process.", urls.size());

                for (String url : urls) {
                    try {
                        JobOffer jo = scrapeSingleJob(page, url);
                        if (jo != null) {
                            allJobs.add(jo);
                            log.info("Successfully scraped: {}", jo.getTitle());
                        }
                        randomHumanDelay(8000, 15000);
                    } catch (Exception e) {
                        log.error("Error scraping {}: {}", url, e.getMessage());
                    }
                }
            }
        }
        return allJobs;
    }

    private JobOffer scrapeSingleJob(Page page, String url) throws Exception {
        log.info("Navigating to job page: {}", url);

        page.navigate(url, new Page.NavigateOptions()
                .setWaitUntil(WaitUntilState.DOMCONTENTLOADED)
                .setReferer("https://www.pracuj.pl/praca")
                .setTimeout(60000));

        if (!handleCloudflare(page)) {
            log.error("Could not bypass Cloudflare for: {}", url);
            return null;
        }

        page.waitForTimeout(3000);

        Document doc = Jsoup.parse(page.content());
        Element script = doc.selectFirst("script#job-schema-org");
        if (script == null) {
            log.warn("JSON-LD script not found on: {}", url);
            return null;
        }

        JsonNode json = objectMapper.readTree(script.dataNodes().get(0).getWholeData());
        Element wrapper = doc.selectFirst("li[data-test*=sections-benefit-employment-type-name] div[class*=tchzayo]");
        String experience = (wrapper != null) ? wrapper.text() : "";

        return JobOfferPracujPlMapper.mapToJobOffer(json, url, experience);
    }

    private List<String> extractJobUrls(Page page) {
        log.info("Extracting job list...");
        page.navigate("https://www.pracuj.pl/praca", new Page.NavigateOptions().setWaitUntil(WaitUntilState.NETWORKIDLE));
        handleCloudflare(page);

        List<String> urls = new ArrayList<>();
        Document doc = Jsoup.parse(page.content());
        doc.select("a[data-test='link-offer'], a[class*=tiles_cnb3rfy]").forEach(e -> {
            String href = e.attr("href");
            if (!href.isBlank()) {
                String fullUrl = href.startsWith("http") ? href : "https://www.pracuj.pl" + href;
                if (!urls.contains(fullUrl)) urls.add(fullUrl);
            }
        });
        return urls;
    }

    private BrowserContext createStealthContext(Playwright playwright) {
        log.info("Creating browser context with Stealth settings.");
        BrowserType.LaunchPersistentContextOptions options = new BrowserType.LaunchPersistentContextOptions()
                .setHeadless(true)
                .setViewportSize(1920, 1080)
                .setArgs(List.of(
                        "--disable-blink-features=AutomationControlled",
                        "--no-sandbox",
                        "--disable-setuid-sandbox",
                        "--use-gl=desktop",
                        "--disable-dev-shm-usage"
                ))
                .setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
                .setExtraHTTPHeaders(Map.of(
                        "sec-ch-ua", "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
                        "sec-ch-ua-mobile", "?0",
                        "sec-ch-ua-platform", "\"Windows\"",
                        "accept-language", "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7"
                ));

        BrowserContext context = playwright.chromium().launchPersistentContext(Paths.get("/tmp/playwright/session"), options);

        context.addInitScript("() => {" +
                "  Object.defineProperty(navigator, 'webdriver', {get: () => undefined});" +
                "  const getParameter = WebGLRenderingContext.prototype.getParameter;" +
                "  WebGLRenderingContext.prototype.getParameter = function(parameter) {" +
                "    if (parameter === 37445) return 'Google Inc. (Intel)';" +
                "    if (parameter === 37446) return 'ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0, D3D11)';" +
                "    return getParameter.apply(this, arguments);" +
                "  };" +
                "  window.chrome = { runtime: {} };" +
                "}");

        return context;
    }

    private boolean handleCloudflare(Page page) {
        for (int i = 0; i < 10; i++) {
            String title = page.title();
            String content = page.content();

            if (title.contains("Just a moment") || content.contains("cf-turnstile") || content.contains("verifying you are human")) {
                log.warn("Cloudflare detected (attempt {}/10). Mimicking activity...", i + 1);

                try {
                    page.mouse().move(random.nextInt(100, 500), random.nextInt(100, 500));
                    page.mouse().click(250, 250); // Statystyczne miejsce Turnstile
                } catch (Exception ignored) {}

                page.waitForTimeout(5000);
            } else {
                log.info("Cloudflare bypassed.");
                return true;
            }
        }
        return false;
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