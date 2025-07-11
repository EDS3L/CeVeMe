package pl.ceveme.infrastructure.external.scrap.theProtocolIt;

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

        String niceToHave = extractNiceToHave(offerNode);
        String benefits = extractBenefits(offerNode);

        return new JobOffer(
                offerLink,
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

    private static String extractNiceToHave(JsonNode oferNode) {
        JsonNode textSections = oferNode.path("textSections");
        if(!textSections.isArray()) {
            return null;
        }

        for (JsonNode section : textSections) {
            String sectionType = section.path("type").asText("");
                if ("requirements-optional".equals(sectionType)) {
                    JsonNode elementsNode = section.path("elements");
                    if(elementsNode.isArray() && !elementsNode.isEmpty()) {
                        StringBuilder stringBuilder = new StringBuilder();
                        for (int i = 0; i < elementsNode.size(); i++) {
                            String niceToHave = elementsNode.get(i).asText("");
                            if(!niceToHave.isEmpty()) {
                                if(!stringBuilder.isEmpty()) {
                                    stringBuilder.append(", ");
                                }
                                stringBuilder.append(niceToHave);
                            }
                        }
                        return !stringBuilder.isEmpty() ? stringBuilder.toString() : null;
                    }
                }

        }
        return null;
    }

    private static String extractSalary(JsonNode employmentNode) {
        JsonNode contractsNode = employmentNode.path("typesOfContracts");
        StringBuilder stringBuilder = new StringBuilder();

        for (int i = 0; i <contractsNode.size(); i++) {
            JsonNode contract = contractsNode.get(i);
            JsonNode salaryNode = contract.path("salary");

            if(!salaryNode.isMissingNode() && !salaryNode.isNull()) {
                if(!stringBuilder.isEmpty()) {
                    stringBuilder.append(" | ");
                }

                String contractName = contract.path("name").asText("");
                if(!contractName.isEmpty()) {
                    stringBuilder.append(contractName).append(": ");
                }

                String from = salaryNode.path("from").asText("");
                String to = salaryNode.path("to").asText("");
                String currency = salaryNode.path("currencyCode").asText("");

                if(!from.isEmpty() && !to.isEmpty()) {
                    stringBuilder.append(from).append("-").append(to);
                } else if(!from.isEmpty()) {
                    stringBuilder.append("od ").append(from);
                } else if(!to.isEmpty()) {
                    stringBuilder.append("do ").append(to);
                }

                if(!currency.isEmpty()) {
                    stringBuilder.append(" ").append(currency);
                }

            }
        }

        return !stringBuilder.isEmpty() ? stringBuilder.toString() : null;
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

    private static String extractBenefits(JsonNode jobOfferNode) {
        JsonNode sectionsNode = jobOfferNode.path("jsonSections");
        if(!sectionsNode.isArray()) {
            return  null;
        }

        StringBuilder benefitsBuilder = new StringBuilder();

        for(JsonNode section : sectionsNode) {
            String sectionType = section.path("sectionType").asText("");

            if("benefits".equals(sectionType)) {
                JsonNode modelNode = section.path("model");
                JsonNode itemsNode = modelNode.path("items");

                if(itemsNode.isArray() && !itemsNode.isEmpty()) {
                    for (int i = 0; i < itemsNode.size(); i++) {
                        JsonNode benefit = itemsNode.get(i);
                        String benefitName = benefit.path("name").asText("");

                        if(!benefitName.isEmpty()) {
                            if(!benefitsBuilder.isEmpty()) {
                                benefitsBuilder.append(", ");
                            }
                            benefitsBuilder.append(benefitName);
                        }
                    }
                }

            break;
            }
        }
        return !benefitsBuilder.isEmpty() ? benefitsBuilder.toString() : null;
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