package pl.ceveme.infrastructure.external.scrap.justJoinIt;

import com.fasterxml.jackson.databind.JsonNode;
import io.swagger.v3.core.util.Json;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.vo.Location;

import java.time.LocalDate;

public class JobOfferJustJoinItMapper {

    public static JobOffer mapToOffer(JsonNode node, String jobLink, String requirements, String experienceLevel) {
        if (node == null) return null;
        JsonNode hiringOrganisation = node.get("hiringOrganization"); //company
        String title = getString(node, "title");
        String company = getString(hiringOrganisation, "name");

        JsonNode jobLocation = node.get("jobLocation");
        JsonNode address = jobLocation.get("address");
        String employmentType = getString(node, "employmentType");
        JsonNode baseSalary = node.get("baseSalary");
        String from = null;
        String to = null;
        String currency = null;
        String salary  = null;
        if(baseSalary != null && !baseSalary.isMissingNode()) {
            JsonNode salaryValue = baseSalary.get("value");
            currency = getString(baseSalary, "currency");
            if(salaryValue != null && !salaryValue.isMissingNode()) {
                from = getString(salaryValue,"minValue");
                to = getString(salaryValue, "maxValue");
                salary = "Od " + from + " " + currency + " do " + to + " " + currency;
            }
        }

        String city = null;
        String street = null;
        Double latitude = null;
        Double longitude = null;
        if (address != null && !address.isMissingNode()) {
            city = getString(address, "addressLocality");
            street = getString(address, "streetAddress");

            JsonNode geo = jobLocation.get("geo");

            if (geo != null && !geo.isMissingNode()) {
                latitude = geo.hasNonNull("latitude") ? geo.get("latitude").asDouble() : null;
                longitude = geo.hasNonNull("longitude") ? geo.get("longitude").asDouble() : null;
            }
        }
        Location location = new Location(city, street, latitude, longitude);
        String responsibilities = getString(node, "description");
        String niceToHave = getString(node, "niceToHaveSkills");
        LocalDate dateAdded = parseDate(getString(node, "datePosted"));
        LocalDate dateEnding = parseDate(getString(node, "validThrough"));

        return new JobOffer(jobLink, title, company, salary, location, requirements, niceToHave, responsibilities, null, experienceLevel, employmentType, dateAdded, dateEnding);
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
