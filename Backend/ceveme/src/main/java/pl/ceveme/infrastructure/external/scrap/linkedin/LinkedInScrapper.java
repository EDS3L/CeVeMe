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
import java.net.http.HttpResponse;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Component
public class LinkedInScrapper extends AbstractJobScraper {

    private static final Logger log = LoggerFactory.getLogger(LinkedInScrapper.class);
    private final HttpClient httpClient;
    private final String BASE_URL = "https://www.linkedin.com/jobs/search?keywords=&location=Poland&geoId=105072130&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=";

    public LinkedInScrapper(HttpClient httpClient, ObjectMapper objectMapper, JobOfferRepository jobOfferRepository, HttpClient httpClient1) {
        super(httpClient, objectMapper, jobOfferRepository);
        this.httpClient = httpClient1;
    }

    private String getHtml(String url) throws IOException, InterruptedException {
        HttpResponse<String> response = httpClient.createHttpGetLinkedIn(url);
        return response.body();
    }

    public List<String> getAllJobOfferUrls() {
        List<String> allUrls = new ArrayList<>();
        Map<Long, String> idToUrl = new HashMap<>();

        int totalPage = getTotalPageNumber();
        log.info("Total pages for LinkedIn = {}", totalPage);
        for (int start = 25; start <= 750; start += 25) {
            String url2 = "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=&location=Poland&geoId=105072130&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0&start=" + start;
//            String url = "https://www.linkedin.com/jobs/search?keywords=&location=Poland&geoId=105072130&trk=public_jobs_jobs-search-bar_search-submit&position="+p+"&pageNum=" + p + ";";
            Document document = fetchDocument(url2);
            Elements links = document.select("a[class*=base-card__full-link]");
            links.forEach(e -> {
                String href = e.attr("href");
                log.info("ID: {}", extractIdFromUrl(href));
                log.info("HREF: {}", href);
                idToUrl.putAll(extractIdFromUrl(href));
                allUrls.add(href);
            });
            delay();
        }

        log.info("List before dist = {}", allUrls.size());
        log.info("Mpa size {}", idToUrl.size());
        return allUrls;
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

    private Integer getTotalPageNumber() {
        Document doc = fetchDocument(BASE_URL + "0;");
        Element elementTotalResults = doc.selectFirst("code#totalResults");
        Element elementResultsPerPage = doc.selectFirst("code#resultsPerPage");

        int totalResults;
        int resultPerPage;
        if (elementTotalResults != null && elementResultsPerPage != null) {

            Node totalResultsNode = elementTotalResults.childNode(0);
            Node resultsPerPageNode = elementResultsPerPage.childNode(0);

            totalResults = Integer.parseInt(((Comment) totalResultsNode).getData().trim());
            resultPerPage = Integer.parseInt(((Comment) resultsPerPageNode).getData().trim());

            log.info("Total Results: {}", totalResults);
            log.info("Results Per Page: {}", resultPerPage);
        } else {
            throw new IllegalArgumentException("Nodes are null!");
        }


        return (int) Math.ceil((double) totalResults / resultPerPage);

    }

    private static Optional<JsonNode> extractJobJson(String html) {
        Document doc = org.jsoup.Jsoup.parse(html);
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
        log.info("Job offer {}", jobOffer);
        return new JobOfferRequest(jobOffer.getTitle(), jobOffer.getCompany(), jobOffer.getRequirements(), jobOffer.getCompany(), jobOffer.getResponsibilities(), jobOffer.getExperienceLevel(), jobOffer.getSalary(), jobOffer.getLocation(), jobOffer.getBenefits(), jobOffer.getEmploymentType(), jobOffer.getDateAdded(), jobOffer.getDateEnding(), "Scrap successful");
    }


}




