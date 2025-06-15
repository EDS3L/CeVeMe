package pl.ceveme.infrastructure.external.theProtocolIt;

import com.fasterxml.jackson.databind.JsonNode;
import pl.ceveme.domain.model.entities.JobOffer;

import java.time.LocalDate;

public class TheProtocolItJobMapper {

    public static JobOffer mapToJobOffer(JsonNode node, String sourceUrl) {
        if (node == null) return null;
        JsonNode offer = node.get("props").path("pageProps").path("offer");

        JsonNode attributes = offer.get("attributes").path("title");
        String title = getString(attributes,"value");
        String company = getString(node, "");
        


//        return new JobOffer(sourceUrl,title,company,salary,location,requirements,null,responsibilities,null,experience,employmentType,dateAdded,dateEnding);
        return null;
    }

    private static String getString(JsonNode node, String field) {
        return node.hasNonNull(field) ? node.get(field).asText() : null;
    }



    private static LocalDate parseDate(String isoDate) {
        if (isoDate == null || isoDate.isEmpty()) return null;
        return LocalDate.parse(isoDate.substring(0, 10));
    }
}
