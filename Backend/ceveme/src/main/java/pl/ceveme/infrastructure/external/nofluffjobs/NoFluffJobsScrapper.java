package pl.ceveme.infrastructure.external.nofluffjobs;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.repositories.JobOfferRepository;
import pl.ceveme.infrastructure.external.common.AbstractJobScraper;
import pl.ceveme.infrastructure.external.common.HttpClient;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Component
public class NoFluffJobsScrapper extends AbstractJobScraper {

    private static final Logger log = LoggerFactory.getLogger(NoFluffJobsScrapper.class);
    private final String JOB_URL = "https://nofluffjobs.com/pl/job/";

    public NoFluffJobsScrapper(HttpClient httpClient, ObjectMapper objectMapper, JobOfferRepository jobOfferRepository) {
        super(httpClient, objectMapper, jobOfferRepository);
    }

    public static String extractDataFormHtml(Document doc, String cssQuery) {
        return doc.select(cssQuery)
                .stream()
                .map(Element::text)
                .filter(t -> !t.isBlank())
                .distinct()
                .collect(Collectors.joining(", "));
    }

    public static LocalDate extractOfferValidUntil(Document doc) {
        String text = doc.select("common-posting-time-info div")
                .stream()
                .map(Element::text)
                .filter(t -> !t.isBlank())
                .findFirst()
                .orElse("");

        Pattern pattern = Pattern.compile("\\d{2}\\.\\d{2}\\.\\d{4}");
        Matcher matcher = pattern.matcher(text);

        if (matcher.find()) {
            String dateStr = matcher.group();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
            return LocalDate.parse(dateStr, formatter);
        }

        return null;
    }

    public List<JobOffer> createJobs() {
        try {
            int pagesCount = totalPage();
            log.info("Total pages for nofluff {}", pagesCount);
            List<String> offerUrls = new ArrayList<>();
            for (int i = 1; i <= 3; i++) {
                log.info("Currnet page for nofluff {}", i);
                String URL = "https://nofluffjobs.com/api/joboffers/main?pageTo=" + i + "&pageSize=20&withSalaryMatch=true&salaryCurrency=PLN&salaryPeriod=month&region=pl&language=pl-PL";
                JsonNode node = objectMapper.readTree(httpClient.fetchContent(URL));
                extractLinks(node, offerUrls);
                delay();
            }
            log.info("List size {}", offerUrls.size());
            return processUrlsNoFluffJobs(offerUrls);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected JobOffer extractJobData(String url) {
        Document doc = fetchDocument(url);
        JsonNode node = parseJson(doc, "script[type*=application/ld+json]");

        LocalDate offerValidUntil = extractOfferValidUntil(doc);
        String niceToHave = extractDataFormHtml(doc, "#posting-nice-to-have li span");
        String benefits = extractDataFormHtml(doc, "[commonpostingperk] span.mb-0");

        log.info("ended date {} nicetohave {} benefits {} link {}", offerValidUntil, niceToHave, benefits, url);
        return NoFluffJobsMapper.mapToOffer(node, url, niceToHave, benefits, offerValidUntil);
    }

    public void extractLinks(JsonNode node, List<String> offerUrls) {
        StreamSupport.stream(node.path("postings")
                        .spliterator(), false)
                .map(n -> n.get("id")
                        .asText(null))
                .filter(s -> s != null && !s.isBlank())
                .map(s -> JOB_URL + s)
                .forEach(offerUrls::add);
    }

    private int totalPage() {
        try {
            String BASE_URL = "https://nofluffjobs.com/api/joboffers/main?pageTo=1&pageSize=20&withSalaryMatch=true&salaryCurrency=PLN&salaryPeriod=month&region=pl&language=pl-PL";
            JsonNode node = objectMapper.readTree(httpClient.fetchContent(BASE_URL));
            return node.path("totalPages")
                    .asInt();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


}
