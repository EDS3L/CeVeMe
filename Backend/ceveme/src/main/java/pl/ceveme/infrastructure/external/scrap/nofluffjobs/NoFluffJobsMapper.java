package pl.ceveme.infrastructure.external.scrap.nofluffjobs;

import com.fasterxml.jackson.databind.JsonNode;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.vo.Location;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class NoFluffJobsMapper {

    public static JobOffer mapToOffer(JsonNode rootNode, String link,String niceToHave, String benefits, LocalDate dateEnding) {
        if (rootNode == null) return null;

        JsonNode jobPostingNode = findJobPosting(rootNode);
        if (jobPostingNode == null) return null;

        String title = getString(jobPostingNode, "title");

        JsonNode hiringOrganization = jobPostingNode.get("hiringOrganization");
        String company = getString(hiringOrganization, "name");

        JsonNode jobLocation = jobPostingNode.get("jobLocation");
        Location location = extractLocation(jobLocation);

        String salary = extractSalary(jobPostingNode);

        String experience = extractExperience(jobPostingNode);

        String employmentType = getString(jobPostingNode, "employmentType");

        String requirements = extractSkills(jobPostingNode);

        String responsibilities = getString(jobPostingNode, "description");

        LocalDate dateAdded = parseDate(getString(jobPostingNode, "datePosted"));


        return new JobOffer(
                link,
                title,
                company,
                salary,
                location,
                requirements,
                niceToHave,
                responsibilities,
                benefits,
                experience,
                employmentType,
                dateAdded,
                dateEnding
        );
    }

    private static JsonNode findJobPosting(JsonNode rootNode) {
        JsonNode graph = rootNode.get("@graph");
        if (graph != null && graph.isArray()) {
            for (JsonNode node : graph) {
                if ("JobPosting".equals(getString(node, "@type"))) {
                    return node;
                }
            }
        }
        return null;
    }

    private static Location extractLocation(JsonNode jobLocation) {
        if (jobLocation == null) return null;

        JsonNode address = jobLocation.get("address");
        if (address == null) return null;

        String city = getString(address, "addressLocality");
        String street = getString(address, "streetAddress");

        return new Location(city, street);
    }

    private static String extractSalary(JsonNode jobPostingNode) {
        JsonNode baseSalary = jobPostingNode.get("baseSalary");
        if (baseSalary == null) return null;

        String currency = getString(baseSalary, "currency");
        JsonNode value = baseSalary.get("value");

        if (value != null) {
            String amount = getString(value, "value");
            String unit = getString(value, "unitText");

            if (amount != null) {
                StringBuilder salary = new StringBuilder();
                salary.append(amount);
                if (currency != null) {
                    salary.append(" ").append(currency);
                }
                if (unit != null) {
                    salary.append(" per ").append(unit.toLowerCase());
                }
                return salary.toString();
            }
        }

        return null;
    }

    private static String extractExperience(JsonNode jobPostingNode) {
        JsonNode experienceReq = jobPostingNode.get("experienceRequirements");
        if (experienceReq != null) {
            return getString(experienceReq, "description");
        }
        return null;
    }

    private static String extractSkills(JsonNode jobPostingNode) {
        JsonNode skills = jobPostingNode.get("skills");
        if (skills == null || !skills.isArray()) return null;

        List<String> skillsList = new ArrayList<>();
        for (JsonNode skill : skills) {
            String skillValue = getString(skill, "value");
            String skillType = getString(skill, "type");

            if (skillValue != null) {
                if ("main".equals(skillType)) {
                    skillsList.addFirst(skillValue);
                } else {
                    skillsList.add(skillValue);
                }
            }
        }

        return skillsList.isEmpty() ? null : String.join(", ", skillsList);
    }


    private static String getString(JsonNode node, String field) {
        return node != null && node.hasNonNull(field) ? node.get(field).asText() : null;
    }

    private static LocalDate parseDate(String isoDate) {
        if (isoDate == null || isoDate.isEmpty()) return null;
        try {
            return LocalDate.parse(isoDate.substring(0, 10));
        } catch (Exception e) {
            return null;
        }
    }
}