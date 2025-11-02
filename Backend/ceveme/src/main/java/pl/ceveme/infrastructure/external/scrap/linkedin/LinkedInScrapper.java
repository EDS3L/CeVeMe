package pl.ceveme.infrastructure.external.scrap.linkedin;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.checkerframework.checker.units.qual.A;
import org.jsoup.Jsoup;
import org.jsoup.nodes.*;
import org.jsoup.parser.Parser;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Component;
import pl.ceveme.application.dto.scrap.JobOfferRequest;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.repositories.JobOfferRepository;
import pl.ceveme.infrastructure.external.common.AbstractJobScraper;
import pl.ceveme.infrastructure.external.common.HttpClient;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Component
public class LinkedInScrapper extends AbstractJobScraper {

    private static final Logger log = LoggerFactory.getLogger(LinkedInScrapper.class);
    private final HttpClient httpClient;

    public LinkedInScrapper(HttpClient httpClient, ObjectMapper objectMapper, JobOfferRepository jobOfferRepository, HttpClient httpClient1) {
        super(httpClient, objectMapper, jobOfferRepository);
        this.httpClient = httpClient1;
    }

    public List<JobOffer> createJobs() throws IOException {
        List<String> urls = getAllJobOfferUrls();
        return processUrls(urls);
    }

    private String getHtml(String url) throws IOException, InterruptedException {
        HttpResponse<String> response = httpClient.createHttpGetLinkedIn(url);
        return response.body();
    }

    public List<String> getAllJobOfferUrls() {
        Map<Long, String> idToUrl = new HashMap<>();
        List<String> seeds = Arrays.asList(
                "https://www.linkedin.com/jobs/search?keywords=&location=Poland&geoId=105072130&f_PP=102560051&f_TPR=&position=1&pageNum=0", // Warszawa
                "https://www.linkedin.com/jobs/search?keywords=&location=Poland&geoId=105072130&f_PP=103348205&f_TPR=&position=1&pageNum=0", // Kraków
                "https://www.linkedin.com/jobs/search?keywords=&location=Poland&geoId=105072130&f_PP=101832192&f_TPR=&position=1&pageNum=0", // Wrocław
                "https://www.linkedin.com/jobs/search?keywords=&location=Poland&geoId=105072130&f_PP=101496088&f_TPR=&position=1&pageNum=0", // Gdańsk
                "https://www.linkedin.com/jobs/search?keywords=&location=Poland&geoId=105072130&f_PP=101782795&f_TPR=&position=1&pageNum=0", // Łódź
                "https://www.linkedin.com/jobs/search?keywords=&location=Poland&geoId=105072130&f_TPR=&position=1&pageNum=0"                  // bez niczego
        );

        final String SEE_MORE_BASE = "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search";
        final int PAGE_STEP = 25;
        final int MAX_START = 975;

        for (String seed : seeds) {
            URI u = URI.create(seed);
            String query = u.getQuery();

            String baseQuery = Arrays.stream(query.split("&"))
                    .filter(p -> !p.startsWith("position=") && !p.startsWith("pageNum="))
                    .collect(java.util.stream.Collectors.joining("&"));

            boolean anyOnFirstPage = false;

            for (int start = 0; start <= MAX_START; start += PAGE_STEP) {
                String seeMoreUrl = SEE_MORE_BASE + "?" + baseQuery + "&start=" + start;

                Document document = fetchDocument(seeMoreUrl);
                if (document == null) {
                    delay();
                    continue;
                }

                Elements links = document.select("a[class*=base-card__full-link][href*='/jobs/view/']");
                if (links.isEmpty()) {
                    if (!anyOnFirstPage) break;
                    break;
                }
                anyOnFirstPage = true;

                links.forEach(a -> {
                    String href = a.attr("href").replace("pl.linkedin.com", "www.linkedin.com").trim();
                    idToUrl.putAll(extractIdFromUrl(href));
                });

                if (links.size() < PAGE_STEP) break;
                delay();
            }
        }

        log.info("Zebrane unikalne oferty: {}", idToUrl.size());
        return new ArrayList<>(idToUrl.values());
    }


    private Map<Long, String> extractIdFromUrl(String url) {
        Pattern p = Pattern.compile("-(\\d+)\\?position");
        Matcher m = p.matcher(url);

        Map<Long, String> map = new HashMap<>();

        while (m.find()) {
            Long id = Long.parseLong(m.group(1));

            if (map.containsKey(id)) {
                log.warn("Duplicate id: {}", id);
                map.remove(id);
            } else {
                map.put(id, url);
            }
        }

        return map;
    }

    private static Optional<JsonNode> extractJobJson(String html) {
        Document doc = Jsoup.parse(html);
        ObjectMapper om = new ObjectMapper();

        for (Element s : doc.select("script[type=application/ld+json]")) {
            String raw = s.data();
            String json = Parser.unescapeEntities(raw, false).trim();
            try {
                JsonNode root = om.readTree(json);
                ArrayDeque<JsonNode> q = new java.util.ArrayDeque<>();
                q.add(root);
                while (!q.isEmpty()) {
                    JsonNode cur = q.poll();
                    if (cur.isObject() && "JobPosting".equals(cur.path("@type").asText(null))) {
                        return Optional.of(cur);
                    }
                    cur.elements().forEachRemaining(q::add);
                }
            } catch (Exception ignore) {
            }
        }

        for (Element el : doc.select("code, script[type=application/json]")) {
            String raw = el.tagName().equals("script") ? el.data() : el.html();
            if (!(raw.contains("job") || raw.contains("Job") || raw.contains("trackingUrn"))) continue;

            String json = org.jsoup.parser.Parser.unescapeEntities(raw, false).trim();
            try {
                JsonNode root = om.readTree(json);
                {
                    ArrayDeque<JsonNode> q = new java.util.ArrayDeque<>();
                    q.add(root);
                    while (!q.isEmpty()) {
                        JsonNode cur = q.poll();
                        if (cur.isObject()) {
                            String urn = cur.path("trackingUrn").asText(null);
                            if (urn != null && urn.contains("jobPosting:")) {
                                return Optional.of(cur);
                            }
                        }
                        cur.elements().forEachRemaining(q::add);
                    }
                }

                {
                    ArrayDeque<JsonNode> q = new java.util.ArrayDeque<>();
                    q.add(root);
                    while (!q.isEmpty()) {
                        JsonNode cur = q.poll();
                        if (cur.isObject()) {
                            boolean hasJobState = cur.has("jobState");
                            boolean hasTitle = cur.has("title") || cur.path("jobPostingInfo").has("title");
                            boolean hasDescText = cur.path("description").has("text");
                            if (hasJobState && (hasTitle || hasDescText)) {
                                return Optional.of(cur);
                            }
                        }
                        cur.elements().forEachRemaining(q::add);
                    }
                }
            } catch (Exception ignore) {
            }
        }

        return Optional.empty();
    }

    @Override
    protected JobOffer extractJobData(String url) throws Exception {
        JsonNode jsonNode = extractJobJson(getHtml(url)).orElseThrow(() -> new RuntimeException("Json from html not found!"));
        return LinkedinMapper.mapToOffer(jsonNode, url, null, null, null);
    }

    public JobOfferRequest getJobDetails(String url) throws Exception {
        JobOffer jobOffer = extractJobData(url);
        log.info("Job: {}", jobOffer);
        return new JobOfferRequest(jobOffer.getTitle(), jobOffer.getCompany(), jobOffer.getRequirements(), jobOffer.getCompany(), jobOffer.getResponsibilities(), jobOffer.getExperienceLevel(), jobOffer.getSalary(), jobOffer.getLocation(), jobOffer.getBenefits(), jobOffer.getEmploymentType(), jobOffer.getDateAdded(), jobOffer.getDateEnding(), "Scrap successful");
    }


}




