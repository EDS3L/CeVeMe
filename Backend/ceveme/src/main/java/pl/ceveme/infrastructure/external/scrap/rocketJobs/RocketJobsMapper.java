package pl.ceveme.infrastructure.external.scrap.rocketJobs;

import com.fasterxml.jackson.databind.JsonNode;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.vo.Location;

import java.time.LocalDate;

public class RocketJobsMapper {

    public static JobOffer mapToOffer(JsonNode node, String link,String salary, String requirements, String exp, String employmentType) {
        if (node == null) return null;
        JsonNode hiringOrganisation = node.get("hiringOrganization"); //company
        String title = getString(node, "title");
        String company = getString(hiringOrganisation, "name");
        JsonNode jobLocation = node.get("jobLocation");
        JsonNode address = jobLocation.get("address");
        String city = null;
        String street = null;
        if (address != null && !address.isMissingNode()) {
            city = getString(address, "addressLocality");
            street = getString(address, "streetAddress");
        }
        Location location = new Location(city, street);
        String responsibilities = getString(node, "description");
        String niceToHave = getString(node, "niceToHaveSkills");
        LocalDate dateAdded = parseDate(getString(node, "datePosted"));
        LocalDate dateEnding = parseDate(getString(node, "validThrough"));

        return new JobOffer(link, title, company, salary, location, requirements, niceToHave, responsibilities, null, exp, employmentType, dateAdded, dateEnding);
    }

    private static String getString(JsonNode node, String field) {
        return node.hasNonNull(field) ? node.get(field)
                .asText() : null;
    }

    private static LocalDate parseDate(String isoDate) {
        if (isoDate == null || isoDate.isEmpty()) return null;
        return LocalDate.parse(isoDate.substring(0, 10));
    }


}
