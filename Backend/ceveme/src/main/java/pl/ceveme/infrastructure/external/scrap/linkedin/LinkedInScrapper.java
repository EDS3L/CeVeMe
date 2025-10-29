package pl.ceveme.infrastructure.external.scrap.linkedin;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Component;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.repositories.JobOfferRepository;
import pl.ceveme.infrastructure.external.common.AbstractJobScraper;
import pl.ceveme.infrastructure.external.common.HttpClient;

import java.io.IOException;
import java.net.http.HttpResponse;

@Component
public class LinkedInScrapper extends AbstractJobScraper {

    private final HttpClient httpClient;

    public LinkedInScrapper(HttpClient httpClient, ObjectMapper objectMapper, JobOfferRepository jobOfferRepository, HttpClient httpClient1) {
        super(httpClient, objectMapper, jobOfferRepository);
        this.httpClient = httpClient1;
    }


    public JsonNode test() throws IOException, InterruptedException {

        java.net.http.HttpResponse<String> response = httpClient.createHttpGetLinkedIn("https://www.linkedin.com/jobs/view/4303470752/");

//        Document document = Jsoup.parse(response.body());
//        Element el = document.selectFirst("code[bpr-guid-11636209]");
//        ObjectMapper mapper = new ObjectMapper();
//        String jsonText = el.text();
//
//        return mapper.readTree(jsonText);


//
        Document document = Document.createShell(response.body());

        return parseJson(document, "code#bpr-guid-11636209");

    }

    @Override
    protected JobOffer extractJobData(String url) throws Exception {
        return null;
    }
}




