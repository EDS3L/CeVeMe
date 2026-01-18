package pl.ceveme.application.database;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class EmploymentNormalizer {


    public String normalize(String raw) {
        Set<EmploymentType> result = new HashSet<>();
        if (raw == null) return result.toString();
        String lower = raw.toLowerCase();

        if (lower.contains("b2b") || lower.contains("contract") || lower.contains("kontrakt") ||
                (lower.contains(
                "contract") && !lower.contains("employment") && !lower.contains("mandate") && !lower.contains(
                "specific work"))) {
            result.add(EmploymentType.B2B);
        }
        if (lower.contains("full_time") || lower.contains("umowa o pracę") || lower.contains("uop") || lower.contains(
                "contract of employments") || lower.contains("prace") || lower.contains("employment")) {
            result.add(EmploymentType.UOP);
        }

        if(lower.contains("zlecen") || lower.contains("mandate") || lower.contains("umowa zlecenie")) {
            result.add(EmploymentType.UZ);
        }

        if (lower.equals("uz") || lower.contains("uz,") || lower.contains(", uz") || lower.contains(" uz ")) {
            result.add(EmploymentType.UZ);
        }

        if(lower.contains("dzieło") || lower.contains("dziele") || lower.contains("specific work")) {
            result.add(EmploymentType.UOD);
        }

        if (lower.equals("uod") || lower.contains("uod,") || lower.contains(", uod")) {
            result.add(EmploymentType.UOD);
        }

        if(lower.contains("staż") || lower.contains("inter") || lower.contains("praktyki")) {
            result.add(EmploymentType.STAZ);
        }

        if(result.isEmpty()) {
            if(lower.contains("other") || lower.contains("dowlona")) {
                result.add(EmploymentType.OTHER);
            }
        }

        return result.stream().map(Enum::name).collect(Collectors.joining(","));

    }
}
