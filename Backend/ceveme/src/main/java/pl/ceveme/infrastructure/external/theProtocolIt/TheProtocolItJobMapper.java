package pl.ceveme.infrastructure.external.theProtocolIt;

import com.fasterxml.jackson.databind.JsonNode;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.vo.Location;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class TheProtocolItJobMapper {
    public static JobOffer mapToJobOffer(JsonNode rootNode, String offerLink) {
        if (rootNode == null) return null;

        JsonNode propsNode = rootNode.path("props");
        JsonNode pagePropsNode = propsNode.path("pageProps");
        JsonNode offerNode = pagePropsNode.path("offer");

        if (offerNode.isMissingNode()) return null;

        JsonNode attributesNode = offerNode.path("attributes");
        JsonNode publicationDetailsNode = offerNode.path("publicationDetails");
        JsonNode employmentNode = attributesNode.path("employment");
        JsonNode workplacesNode = attributesNode.path("workplaces");


        String title = getString(attributesNode.path("title"), "value");

        String company = null;
        JsonNode employerNode = attributesNode.path("employer");
        if (!employerNode.isMissingNode()) {
            company = getString(employerNode, "name");
        }

        String salary = extractSalary(employmentNode);

        Location location = extractLocation(workplacesNode);

        String requirements = extractRequirements(offerNode);
        String responsibilities = extractResponsibilities(offerNode);

        String employmentType = extractEmploymentType(employmentNode);
        String experience = extractExperience(employmentNode);

        LocalDate dateAdded = parseDateTime(getString(publicationDetailsNode, "dateOfInitialPublicationUtc"));
        LocalDate dateEnding = parseDateTime(getString(publicationDetailsNode, "archivizationDateUtc"));

        return new JobOffer(
                offerLink,
                title,
                company,
                salary,
                location,
                requirements,
                null,
                responsibilities,
                null,
                experience,
                employmentType,
                dateAdded,
                dateEnding
        );
    }

    private static String extractSalary(JsonNode employmentNode) {
        JsonNode contractsNode = employmentNode.path("typesOfContracts");
        if (contractsNode.isArray() && !contractsNode.isEmpty()) {
            JsonNode firstContract = contractsNode.get(0);
            JsonNode salaryNode = firstContract.path("salary");
            if (!salaryNode.isMissingNode() && !salaryNode.isNull()) {
                //todo: dodać wyciągania salaryy
                return null;
            }
        }
        return null;
    }

    private static Location extractLocation(JsonNode workplacesNode) {
        if (workplacesNode.isArray() && !workplacesNode.isEmpty()) {
            JsonNode firstWorkplace = workplacesNode.get(0);
            String city = getString(firstWorkplace, "city");
            String address = getString(firstWorkplace, "address");

            if (city != null || address != null) {
                return new Location(city, address);
            }
        }
        return null;
    }

    private static String extractRequirements(JsonNode offerNode) {
        StringBuilder requirements = new StringBuilder();

        JsonNode textSectionsNode = offerNode.path("textSections");
        if (textSectionsNode.isArray()) {
            for (JsonNode section : textSectionsNode) {
                String type = getString(section, "type");
                if ("requirements-expected".equals(type) || "requirements-optional".equals(type)) {
                    JsonNode elementsNode = section.path("elements");
                    if (elementsNode.isArray()) {
                        for (JsonNode element : elementsNode) {
                            if (!requirements.isEmpty()) {
                                requirements.append("; ");
                            }
                            requirements.append(element.asText());
                        }
                    }
                }
            }
        }

        JsonNode technologiesNode = offerNode.path("technologies");
        if (!technologiesNode.isMissingNode()) {
            JsonNode optionalTech = technologiesNode.path("optional");
            if (optionalTech.isArray() && !optionalTech.isEmpty()) {
                if (!requirements.isEmpty()) {
                    requirements.append("; ");
                }
                requirements.append("Technologie: ");
                for (int i = 0; i < optionalTech.size(); i++) {
                    if (i > 0) requirements.append(", ");
                    requirements.append(getString(optionalTech.get(i), "name"));
                }
            }
        }

        return !requirements.isEmpty() ? requirements.toString() : null;
    }

    private static String extractResponsibilities(JsonNode offerNode) {
        JsonNode textSectionsNode = offerNode.path("textSections");
        if (textSectionsNode.isArray()) {
            for (JsonNode section : textSectionsNode) {
                String type = getString(section, "type");
                if ("responsibilities".equals(type)) {
                    JsonNode elementsNode = section.path("elements");
                    if (elementsNode.isArray()) {
                        StringBuilder responsibilities = new StringBuilder();
                        for (JsonNode element : elementsNode) {
                            if (!responsibilities.isEmpty()) {
                                responsibilities.append("; ");
                            }
                            responsibilities.append(element.asText());
                        }
                        return responsibilities.toString();
                    }
                }
            }
        }
        return null;
    }

    private static String extractEmploymentType(JsonNode employmentNode) {
        JsonNode contractsNode = employmentNode.path("typesOfContracts");
        if (contractsNode.isArray() && !contractsNode.isEmpty()) {
            JsonNode firstContract = contractsNode.get(0);
            return getString(firstContract, "name");
        }

        JsonNode workScheduleNode = employmentNode.path("workScheduleIds");
        if (workScheduleNode.isArray() && !workScheduleNode.isEmpty()) {
            return workScheduleNode.get(0).asText();
        }

        return null;
    }

    private static String extractExperience(JsonNode employmentNode) {
        JsonNode positionLevelNode = employmentNode.path("positionLevelIds");
        if (positionLevelNode.isArray() && !positionLevelNode.isEmpty()) {
            return positionLevelNode.get(0).asText();
        }
        return null;
    }

    private static String getString(JsonNode node, String field) {
        return node.hasNonNull(field) ? node.get(field).asText() : null;
    }

    private static LocalDate parseDateTime(String isoDateTime) {
        if (isoDateTime == null || isoDateTime.isEmpty()) return null;
        try {
            LocalDateTime dateTime = LocalDateTime.parse(isoDateTime, DateTimeFormatter.ISO_DATE_TIME);
            return dateTime.toLocalDate();
        } catch (Exception e) {
            try {
                return LocalDate.parse(isoDateTime.substring(0, 10));
            } catch (Exception ex) {
                return null;
            }
        }
    }
}