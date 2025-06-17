package pl.ceveme.infrastructure.external.theProtocolIt;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.DocumentType;
import org.jsoup.nodes.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.repositories.JobOfferRepository;
import pl.ceveme.infrastructure.external.common.AbstractJobScraper;
import pl.ceveme.infrastructure.external.common.HttpClient;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.stream.IntStream;
import java.util.stream.StreamSupport;

@Component
public class TheProtocolItScrapper extends AbstractJobScraper {

    private static final Logger log = LoggerFactory.getLogger(TheProtocolItScrapper.class);
    private static final String BASE_URL = "https://theprotocol.it/praca?pageNumber=";
    private static final String OFFER_URL = "https://theprotocol.it/szczegoly/praca";

    public TheProtocolItScrapper(HttpClient httpClient, ObjectMapper objectMapper, JobOfferRepository jobOfferRepository) {
        super(httpClient, objectMapper, jobOfferRepository);
    }

    public List<JobOffer> createJobs() throws IOException {
        List<String> urls = fetchAllJobLinks();
        return processUrls(urls);
    }

    public List<String> fetchAllJobLinks() throws IOException {
        JsonNode first = fetchPageJson(BASE_URL + "1");
        int totalPages = calculateTotalPages(first);
        log.info("Total page {}", totalPages);
        List<String> all = new ArrayList<>(parseJobLinks(first));
        IntStream.rangeClosed(2, totalPages).forEach(p -> {
            try {
                log.info("Currnet page {}", p);
                TimeUnit.MILLISECONDS.sleep(1000);
                JsonNode page = fetchPageJson(BASE_URL +  p);
                all.addAll(parseJobLinks(page));
                delay();
            } catch (Exception e) {
                log.warn("Failed add jobs to list {}", e.getMessage());
            }
        });
        return all.stream().distinct().toList();
    }


    private JsonNode fetchPageJson(String url) {
        try {
            String html = httpClient.fetchContent(url);
            Document doc = Jsoup.parse(html,url);
            Element script = doc.selectFirst("script[id*=__NEXT_DATA__]");
            if (script == null) throw new IOException("No __NEXT_DATA__ on " + url);
            return objectMapper.readTree(script.dataNodes().getFirst().getWholeData());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private List<String> parseJobLinks(JsonNode node) {
        return StreamSupport.stream(node.path("props")
                        .path("pageProps")
                        .path("offersResponse")
                        .path("offers")
                        .spliterator(), false)
                .map(j -> j.path("offerUrlName")
                        .asText(null))
                .filter(Objects::nonNull)
                .map(id -> OFFER_URL + "/" + id)
                .toList();
    }


    private int calculateTotalPages(JsonNode node) {
        JsonNode offersResponse = node.path("props")
                .path("pageProps")
                .path("offersResponse");
        int size = offersResponse.path("page")
                .path("size")
                .asInt();
        int offersCount = offersResponse.path("offersCount")
                .asInt();
        return (int) Math.ceil((double) offersCount / size);
    }

    @Override
    protected JobOffer extractJobData(String url) throws Exception {
        String html = httpClient.fetchContent(url);
        Document doc = Jsoup.parse(html, url);

        JsonNode data = parseJson(doc, "script[id*=__NEXT_DATA__]");


        log.info("Extracted data {} from {}",TheProtocolItJobMapper.mapToJobOffer(data,url).toString(),url);
        return TheProtocolItJobMapper.mapToJobOffer(data,url);

    }
}
