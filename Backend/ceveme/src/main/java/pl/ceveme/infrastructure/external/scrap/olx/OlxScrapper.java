package pl.ceveme.infrastructure.external.scrap.olx;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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

import java.util.stream.Collectors;

@Component
public class OlxScrapper extends AbstractJobScraper {

    private static final Logger log = LoggerFactory.getLogger(OlxScrapper.class);

    public OlxScrapper(HttpClient httpClient, ObjectMapper objectMapper, JobOfferRepository jobOfferRepository) {
        super(httpClient, objectMapper, jobOfferRepository);
    }

    public JobOfferRequest getJobDetails(String url) throws Exception {
        JobOffer jobOffer = extractJobData(url);
        return new JobOfferRequest(jobOffer.getTitle(), jobOffer.getCompany(), jobOffer.getRequirements(), jobOffer.getCompany(), jobOffer.getResponsibilities(), jobOffer.getExperienceLevel(),jobOffer.getSalary(),jobOffer.getLocation(),jobOffer.getBenefits(),jobOffer.getEmploymentType(),jobOffer.getDateAdded(),jobOffer.getDateEnding(), "Scrap successful");
    }

    public static String extractDataFormHtml(Document doc, String cssQuery) {
        return doc.select(cssQuery)
                .stream()
                .map(Element::text)
                .filter(t -> !t.isBlank())
                .distinct()
                .collect(Collectors.joining(", "));
    }

    @Override
    protected JobOffer extractJobData(String url) {
        Document doc = fetchDocument(url);
        JsonNode node = parseJson(doc, "script[type*=application/ld+json]");
        String company = extractCompanyFromHtml(doc);

        return OlxMapper.mapToOffer(node,url,company);
    }



    private static String extractCompanyFromHtml(Document doc) {
        Element h4 = doc.selectFirst("h4.css-ciptap[data-testid=user-profile-user-name]");
        return h4 != null ? h4.text().trim() : "";
    }

}
