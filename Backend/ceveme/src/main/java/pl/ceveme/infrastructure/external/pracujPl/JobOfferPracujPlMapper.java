package pl.ceveme.infrastructure.external.pracujPl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.NullNode;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.vo.Location;

import java.time.LocalDate;
import java.util.Optional;


public class JobOfferPracujPlMapper {

    public static JobOffer mapToJobOffer(JsonNode node, String sourceUrl) {
        if (node == null) return null;

        String title = getString(node, "title");
        String company = getString(node, "hiringOrganization");
        String salary = null;
        JsonNode baseSalary = node.get("baseSalary");
        if(!baseSalary.isNull() && !baseSalary.isMissingNode()) {
            String minValue = getString(baseSalary, "minValue");
            String maxValue = getString(baseSalary, "maxValue");
            String currency = getString(baseSalary, "currency");
            salary = "Od " + minValue + " " + currency + " do " + maxValue + " " + currency;
        } else {
            salary = "";
        }
        String requirements = getString(node, "experienceRequirements");
        String niceToHave = "";
        String responsibilities = getString(node, "responsibilities");
        String benefits = getString(node, "jobBenefits");

        LocalDate dateAdded = parseDate(getString(node, "datePosted"));
        LocalDate dateEnding = parseDate(getString(node, "validThrough"));


        Location location = null;
        JsonNode jobLocation = node.get("jobLocation");
        if (jobLocation != null && jobLocation.has("address")) {
            JsonNode address = jobLocation.get("address");
            String city = getString(address, "addressLocality");
            String street = getString(address, "streetAddress");
            location = new Location(city, street);
        }

        return new JobOffer(sourceUrl, title, company, salary, location, requirements, niceToHave, responsibilities, benefits, dateAdded, dateEnding);
    }

    private static String getString(JsonNode node, String field) {
        return node.hasNonNull(field) ? node.get(field).asText() : null;
    }

    private static LocalDate parseDate(String isoDate) {
        if (isoDate == null || isoDate.isEmpty()) return null;
        return LocalDate.parse(isoDate.substring(0, 10));
    }
}
