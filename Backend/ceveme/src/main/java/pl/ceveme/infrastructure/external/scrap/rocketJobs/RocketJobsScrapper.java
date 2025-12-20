package pl.ceveme.infrastructure.external.scrap.rocketJobs;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Component
public class    RocketJobsScrapper extends AbstractJobScraper {

    private static final Logger log = LoggerFactory.getLogger(RocketJobsScrapper.class);
    private static final String API_URL = "https://api.rocketjobs.pl/v2/user-panel/offers/by-cursor?itemsCount=100&orderBy=DESC&sortBy=published&from=";
    private static final String OFFER_URL = "https://rocketjobs.pl/oferta-pracy/";

    public RocketJobsScrapper(HttpClient httpClient, ObjectMapper objectMapper, JobOfferRepository jobOfferRepository) {
        super(httpClient, objectMapper, jobOfferRepository);
    }

    public JobOfferRequest getJobDetails(String url) throws Exception {
        JobOffer jobOffer = extractJobData(url);
        return new JobOfferRequest(jobOffer.getTitle(), jobOffer.getCompany(), jobOffer.getRequirements(), jobOffer.getCompany(), jobOffer.getResponsibilities(), jobOffer.getExperienceLevel(),jobOffer.getSalary(),jobOffer.getLocation(),jobOffer.getBenefits(),jobOffer.getEmploymentType(),jobOffer.getDateAdded(),jobOffer.getDateEnding(), "Scrap successful");
    }

    @Override
    protected JobOffer extractJobData(String url) throws Exception {
        Document doc = fetchDocument(url);
        JsonNode json = parseJson(doc, "div[class*=mui-cczjeo]");

        String tech = doc.select("h4[class*=mui-21rn3r]")
                .stream()
                .map(Element::text)
                .filter(t -> !t.isBlank())
                .distinct()
                .collect(Collectors.joining(", "));
        Elements elements = doc.select("div.mui-iyvspn");
        String contractType = null;
        String exp = null;
        if(elements.size() >= 3) {
            contractType = elements.get(1).text();
            exp =  elements.get(2).text();
        }

//        String salary = Optional.ofNullable(doc.selectFirst("div[class*=mui-i051vu]"))
//                .map(w -> w.child(0)
//                        .text())
//                .orElse(null);

        String salary = extractSalary(doc);

        log.info("Extracted data exp: {} tech: {} emptype: {}  salary: {} link {}", exp, tech, contractType, salary, url);
        return RocketJobsMapper.mapToOffer(json, url, salary, tech, exp, contractType);
    }

    public List<JobOffer> createJobs() {
        try {
            int totalItem = totalItemNumber();
            log.info("Total pages Rocket Jobs {}", totalItem);
            List<String> allUrls = new ArrayList<>();
            for (int i = 100; i <= 200; i += 100) {
                log.info("Currnet page Rocket Jobs {}", i);
                JsonNode page = objectMapper.readTree(httpClient.fetchContentJJI(String.format(API_URL, i)));
                extractLinks(page, allUrls);
                delay();
            }
            return processUrls(allUrls);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private String extractSalary(Document document) {
        Element label = document.selectFirst("span:contains(Wynagrodzenie)");

        if(label != null) {
            Element salaryContainer = label.nextElementSibling();

            if(salaryContainer != null) {
                String salaryDetails = salaryContainer.select("span.MuiTypography-subtitle4").text();

                Elements spans = salaryContainer.select("div.MuiTypography-h4 span");

                if(spans.size() >= 2) {
                    String salaryFrom = spans.get(0).text();
                    String salaryTo = spans.get(1).text();

                    String fullRangeText = salaryContainer.select("div.MuiTypography-h4").text();
                    String currency = fullRangeText.replaceAll(".*[0-9]\\s*", "");

                    log.info("Extracted salary from {} to {}", salaryFrom, salaryTo);

                    return String.format("%s - %s %s (%s)", salaryFrom, salaryTo, currency, salaryDetails);
                }

                return salaryContainer.select("div.MuiTypography-h4").text() + " " + salaryDetails;
            }
        }
        return null;
    }

    private void extractLinks(JsonNode node, List<String> allUrls) {
        StreamSupport.stream(node.path("data")
                        .spliterator(), false)
                .map(n -> n.path("slug")
                        .asText(null))
                .filter(s -> s != null && !s.isBlank())
                .map(s -> OFFER_URL + s)
                .forEach(allUrls::add);
    }

    private int totalItemNumber() {
        try {
            JsonNode firstPage = objectMapper.readTree(httpClient.fetchContentJJI(String.format(API_URL, 1)));
            return firstPage.path("meta")
                    .path("totalItems")
                    .asInt();
        } catch (IOException  e) {
            throw new RuntimeException(e);
        }
    }

}
