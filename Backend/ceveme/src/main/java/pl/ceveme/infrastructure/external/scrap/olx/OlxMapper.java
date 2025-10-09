package pl.ceveme.infrastructure.external.scrap.olx;

import com.fasterxml.jackson.databind.JsonNode;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.vo.Location;

import java.time.LocalDate;

public class OlxMapper {

    public static JobOffer mapToOffer(JsonNode jsonNode, String link, String company) {
        if(jsonNode == null) return null;

        String title = getString(jsonNode,"title");
        String description = getString(jsonNode, "description");

        JsonNode jobLocation = jsonNode.get("jobLocation");
        Location location = extractLocation(jobLocation);

        String rawDate = getString(jsonNode,"datePosted");
        LocalDate dateAdded = parseDate(rawDate);

        String salary = extractSalary(jsonNode);

        JsonNode employmentTypeList = jsonNode.get("employmentType");
        String employmentType = employmentTypeList.get(0).asText();

        return new JobOffer(
                link,
                title,
                company,
                salary,
                location,
                description,
                null,
                null,
                null,
                null,
                employmentType,
                dateAdded,
                null
        );

    }


    private static String getString(JsonNode node, String field) {
        return node != null && node.hasNonNull(field) ? node.get(field)
                .asText() : null;
    }

    private static Location extractLocation(JsonNode jobLocation) {
        if (jobLocation == null) return null;

        JsonNode address = jobLocation.get("address");
        if (address == null) return null;

        String city = getString(address, "addressLocality");
        String street = getString(address, "streetAddress");

        return new Location(city, street);
    }

    private static LocalDate parseDate(String isoDate) {
        if (isoDate == null || isoDate.isEmpty()) return null;
        try {
            return LocalDate.parse(isoDate.substring(0, 10));
        } catch (Exception e) {
            return null;
        }
    }

    private static String extractSalary(JsonNode jobPostingNode) {
        JsonNode baseSalary = jobPostingNode.get("baseSalary");
        if (baseSalary == null) return null;

        String currency = getString(baseSalary, "currency");
        JsonNode value = baseSalary.get("value");

        if (value != null) {
            JsonNode amount = baseSalary.get("value");
            String unit = getString(value, "unitText");



            if (amount != null) {
                StringBuilder salary = new StringBuilder();
                String minValue = getString(amount, "minValue");
                String maxValue = getString(amount, "maxValue");
                if(minValue != null) salary.append(minValue);
                if (currency != null) {
                    salary.append(" ");
                }
                salary.append("-").append(" ");
                if(maxValue != null) salary.append(maxValue).append(currency);
                if (unit != null) {
                    salary.append(" per ").append(unit.toLowerCase());
                }
                return salary.toString();
            }
        }

        return null;
    }
}