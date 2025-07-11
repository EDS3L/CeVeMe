package pl.ceveme.infrastructure.external.scrap.solidJobs;


import com.fasterxml.jackson.databind.JsonNode;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.vo.Location;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public class SolidJobsMapper {


    public static JobOffer mapToJobOffer(JsonNode rootNode) {
        if (rootNode == null || !rootNode.get("isFound")
                .asBoolean(false)) {
            return null;
        }

        JsonNode jobDetails = rootNode.get("jobOfferDetails");
        if (jobDetails == null) {
            return null;
        }

        String sourceUrl = createLink(getString(jobDetails,"id"), getString(jobDetails,"jobOfferUrl"));

        String title = getString(jobDetails, "jobTitle");
        String company = getString(jobDetails, "companyDisplayName");
        String salary = buildSalaryString(jobDetails);
        String requirements = extractRequirements(jobDetails);
        String niceToHave = "";
        String experienceLevel = getString(jobDetails, "experienceLevel");
        String employmentType = getEmploymentType(jobDetails);
        String responsibilities = extractResponsibilities(jobDetails);
        String benefits = extractBenefits(jobDetails);
        LocalDate dateAdded = parseDate(getString(jobDetails, "validFrom"));
        LocalDate dateEnding = parseDate(getString(jobDetails, "validTo"));

        Location location = extractLocation(jobDetails);

        return new JobOffer(sourceUrl, title, company, salary, location, requirements, niceToHave, responsibilities, benefits, experienceLevel, employmentType, dateAdded, dateEnding);
    }

    private static String getString(JsonNode node, String field) {
        return node.hasNonNull(field) ? node.get(field)
                .asText() : null;
    }

    private static String buildSalaryString(JsonNode jobDetails) {
        JsonNode salaryRange = jobDetails.get("salaryRange");
        if (salaryRange == null || salaryRange.isNull()) {
            return "";
        }

        Double lowerBound = salaryRange.has("lowerBound") ? salaryRange.get("lowerBound")
                .asDouble() : null;
        Double upperBound = salaryRange.has("upperBound") ? salaryRange.get("upperBound")
                .asDouble() : null;
        String currency = getString(salaryRange, "currency");
        String employmentType = getString(salaryRange, "employmentType");
        String period = getString(salaryRange, "salaryPeriod");

        if (lowerBound == null && upperBound == null) {
            return "";
        }

        StringBuilder salary = new StringBuilder();
        if (lowerBound != null && upperBound != null) {
            salary.append(String.format("%.0f–%.0f", lowerBound, upperBound));
        } else if (lowerBound != null) {
            salary.append(String.format("Od %.0f", lowerBound));
        } else {
            salary.append(String.format("Do %.0f", upperBound));
        }
        if (currency != null) {
            salary.append(" ")
                    .append(currency);
        }
        if (employmentType != null) {
            salary.append(" (")
                    .append(employmentType)
                    .append(")");
        }
        if (period != null && !period.equals("Month")) {
            salary.append("/")
                    .append(period.toLowerCase());
        }

        return salary.toString();
    }

    private static String getEmploymentType(JsonNode jobDetails) {
        JsonNode salaryRange = jobDetails.get("salaryRange");
        if (salaryRange != null && salaryRange.has("employmentType")) {
            return getString(salaryRange, "employmentType");
        }
        return null;
    }

    private static String extractRequirements(JsonNode jobDetails) {
        String candidateProfile = getString(jobDetails, "candidateProfile");
        if (candidateProfile != null) {
            return candidateProfile.replaceAll("<[^>]+>", "")
                    .replaceAll("&amp;", "&")
                    .trim();
        }
        return null;
    }

    private static String extractResponsibilities(JsonNode jobDetails) {
        String jobDescription = getString(jobDetails, "jobDescription");
        if (jobDescription != null) {
            return jobDescription.replaceAll("<[^>]+>", "")
                    .replaceAll("&amp;", "&")
                    .trim();
        }
        return null;
    }

    private static String extractBenefits(JsonNode jobDetails) {
        JsonNode benefits = jobDetails.get("benefits");
        if (benefits == null || benefits.isNull()) {
            return "";
        }

        StringBuilder benefitsText = new StringBuilder();

        if (benefits.get("trainingBudget")
                .asBoolean(false)) {
            benefitsText.append("Training budget, ");
        }
        if (benefits.get("inHouseTrainings")
                .asBoolean(false)) {
            benefitsText.append("In-house trainings, ");
        }
        if (benefits.get("conferenceBudget")
                .asBoolean(false)) {
            benefitsText.append("Conference budget, ");
        }
        if (benefits.get("medicalCare")
                .asBoolean(false)) {
            benefitsText.append("Medical care, ");
        }
        if (benefits.get("insurance")
                .asBoolean(false)) {
            benefitsText.append("Insurance, ");
        }
        if (benefits.get("sportSubscription")
                .asBoolean(false)) {
            benefitsText.append("Sport subscription, ");
        }
        if (benefits.get("languageClasses")
                .asBoolean(false)) {
            benefitsText.append("Language classes, ");
        }
        if (benefits.get("freeCoffee")
                .asBoolean(false)) {
            benefitsText.append("Free coffee, ");
        }
        if (benefits.get("freeBeverages")
                .asBoolean(false)) {
            benefitsText.append("Free beverages, ");
        }
        if (benefits.get("freeLunch")
                .asBoolean(false)) {
            benefitsText.append("Free lunch, ");
        }
        if (benefits.get("carParking")
                .asBoolean(false)) {
            benefitsText.append("Car parking, ");
        }
        if (benefits.get("bikeParking")
                .asBoolean(false)) {
            benefitsText.append("Bike parking, ");
        }
        if (benefits.get("chillOutRoom")
                .asBoolean(false)) {
            benefitsText.append("Chill-out room, ");
        }
        if (benefits.get("relocationPackage")
                .asBoolean(false)) {
            benefitsText.append("Relocation package, ");
        }
        if (benefits.get("b2bPaidVacationLeave")
                .asBoolean(false)) {
            benefitsText.append("B2B paid vacation leave, ");
        }
        if (benefits.get("b2bPaidSickLeave")
                .asBoolean(false)) {
            benefitsText.append("B2B paid sick leave, ");
        }

        String remotePossible = getString(jobDetails, "remotePossible");
        if (remotePossible != null && !remotePossible.isEmpty()) {
            benefitsText.append("Remote work: ")
                    .append(remotePossible)
                    .append(", ");
        }

        String workHours = getString(jobDetails, "workHours");
        if (workHours != null && !workHours.isEmpty()) {
            benefitsText.append(workHours)
                    .append(", ");
        }

        if (benefitsText.length() > 2) {
            benefitsText.setLength(benefitsText.length() - 2);
        }

        return benefitsText.toString();
    }

    private static Location extractLocation(JsonNode jobDetails) {
        JsonNode locations = jobDetails.get("locations");
        if (locations == null || !locations.isArray() || locations.size() == 0) {
            return null;
        }

        JsonNode firstLocation = locations.get(0);
        String city = getString(firstLocation, "city");
        String street = getString(firstLocation, "street");
        String buildingNumber = getString(firstLocation, "buildingNumber");

        String fullStreet = street;
        if (buildingNumber != null && !buildingNumber.isEmpty()) {
            fullStreet = street + " " + buildingNumber;
        }

        return new Location(city, fullStreet);
    }

    private static LocalDate parseDate(String isoDate) {
        if (isoDate == null || isoDate.isEmpty()) {
            return null;
        }

        try {
            OffsetDateTime offsetDateTime = OffsetDateTime.parse(isoDate);
            return offsetDateTime.toLocalDate();
        } catch (Exception e) {
            try {
                return LocalDate.parse(isoDate.substring(0, 10));
            } catch (Exception ex) {
                return null;
            }
        }
    }

    private static String createLink(String id,String jobOfferUrl) {
        return "https://solid.jobs/offer/" + id + "/" + jobOfferUrl;
    }
}