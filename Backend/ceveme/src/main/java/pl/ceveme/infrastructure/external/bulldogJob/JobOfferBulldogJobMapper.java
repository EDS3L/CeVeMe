package pl.ceveme.infrastructure.external.bulldogJob;

import com.fasterxml.jackson.databind.JsonNode;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.vo.Location;

import java.time.LocalDate;

public class JobOfferBulldogJobMapper {


    public static JobOffer mapToJobOffer(JsonNode node, String offerLink, String employmentType, String experience) {
        if (node == null) return null;
        JsonNode hiringOrganization = node.get("hiringOrganization");
        JsonNode jobLocation = node.get("jobLocation");
        JsonNode address = null;

        if (jobLocation != null && jobLocation.isArray() && !jobLocation.isEmpty()) {
            JsonNode firstLocation = jobLocation.get(0);
            address = firstLocation.get("address");
        }


        String title = getString(node, "title");
        String company = null;
        if (hiringOrganization != null && !hiringOrganization.isMissingNode()) {
            company = getString(hiringOrganization, "name");
        }
        String salary = null;
        JsonNode baseSalary = node.path("baseSalary");
        if (!baseSalary.isMissingNode()) {
            JsonNode value = baseSalary.path("value");
            String min = getString(value, "minValue");
            String max = getString(value, "maxValue");
            String currency = getString(baseSalary, "currency");
            salary = "Od %s %s do %s %s".formatted(min, currency, max, currency);
        }
        String requirements = getString(node, "skills");
        String responsibilities = getString(node, "description");
        LocalDate dateAdded = parseDate(getString(node, "datePosted"));
        LocalDate dateEnding = parseDate(getString(node, "validThrough"));
        Location location = null;
        if (address != null && !address.isMissingNode()) {
            String city = getString(address, "addressLocality");
            String street = getString(address, "streetAdress");
            location = new Location(city,street);
        }


        return new JobOffer(offerLink,title,company,salary,location,requirements,null,responsibilities,null,experience,employmentType,dateAdded,dateEnding);
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
