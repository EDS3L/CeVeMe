package pl.ceveme.infrastructure.external.scrap.linkedin;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.vo.Location;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.apache.commons.lang3.Validate.notBlank;

public class LinkedinMapper {

    public static JobOffer mapToOffer(JsonNode node,
                                      String link,
                                      String niceToHaveParam,
                                      String benefitsParam,
                                      LocalDate dateEnding) {
        if (node == null) return null;

        String title = str(node, "title");
        String company = str(path(node, "companyDetails"), "name");

        String responsibilities = str(path(node, "description"), "text");

        String employmentType = parseUrnSuffix(str(node, "*employmentStatus"));

        String salary = extractSalary(node);

        Location location = extractLocation(node);

        LocalDate dateAdded = firstNonNull(
                parseEpoch(strLong(node, "listedAt")),
                parseEpoch(strLong(node, "originalListedAt")),
                parseEpoch(strLong(node, "createdAt"))
        );

        LocalDate dateEnd = dateEnding != null ? dateEnding : parseEpoch(strLong(node, "expireAt"));

        String requirements = null;
        String niceToHave = nullIfBlank(niceToHaveParam);
        String benefits = nullIfBlank(benefitsParam);
        String experience = null;

        return new JobOffer(
                link,
                nullIfBlank(title),
                nullIfBlank(company),
                nullIfBlank(salary),
                location,
                requirements,
                niceToHave,
                responsibilities,
                benefits,
                experience,
                nullIfBlank(employmentType),
                dateAdded,
                dateEnd
        );
    }

    private static String extractSalary(JsonNode n) {
        JsonNode base = n.get("baseSalary");
        if (base == null) return null;
        String currency = str(base, "currency");
        JsonNode value = base.get("value");
        if (value == null) return null;

        String one = str(value, "value");
        String min = str(value, "minValue");
        String max = str(value, "maxValue");
        String unit = firstNonBlank(str(base, "unitText"), str(value, "unitText"));

        String amount;
        if (!isBlank(one)) amount = one;
        else if (!isBlank(min) || !isBlank(max)) amount = joinRange(min, max);
        else return null;

        StringBuilder sb = new StringBuilder(amount);
        if (!isBlank(currency)) sb.append(" ").append(currency);
        if (!isBlank(unit)) sb.append(" / ").append(unit.toLowerCase());
        return sb.toString();
    }

    private static Location extractLocation(JsonNode n) {
        String formatted = str(n, "formattedLocation");
        if (!isBlank(formatted)) {
            String city = formatted.split(",")[0].trim();
            return new Location(nullIfBlank(city), null);
        }
        JsonNode addr = path(n, "jobLocation", "address");
        if (addr != null && addr.isObject()) {
            String city = str(addr, "addressLocality");
            String street = str(addr, "streetAddress");
            if (!isBlank(city) || !isBlank(street)) {
                return new Location(nullIfBlank(city), nullIfBlank(street));
            }
        }
        return null;
    }

    private static String parseUrnSuffix(String urn) {
        if (isBlank(urn)) return null;
        int idx = urn.lastIndexOf(':');
        if (idx >= 0 && idx + 1 < urn.length()) {
            return urn.substring(idx + 1);
        }
        return urn;
    }

    private static LocalDate parseEpoch(Long epochMillis) {
        if (epochMillis == null || epochMillis <= 0) return null;
        return Instant.ofEpochMilli(epochMillis).atZone(ZoneId.systemDefault()).toLocalDate();
    }

    private static Long strLong(JsonNode n, String field) {
        return (n != null && n.hasNonNull(field)) ? n.get(field).asLong() : null;
    }

    private static JsonNode path(JsonNode n, String... fields) {
        JsonNode cur = n;
        for (String f : fields) {
            if (cur == null || !cur.has(f)) return null;
            cur = cur.get(f);
        }
        return cur;
    }

    private static String str(JsonNode n, String field) {
        return (n != null && n.hasNonNull(field)) ? n.get(field).asText() : null;
    }

    private static String firstNonBlank(String a, String b) {
        return !isBlank(a) ? a : (!isBlank(b) ? b : null);
    }

    private static LocalDate firstNonNull(LocalDate a, LocalDate b, LocalDate c) {
        return a != null ? a : (b != null ? b : c);
    }

    private static String joinRange(String min, String max) {
        if (!isBlank(min) && !isBlank(max)) return min + "–" + max;
        return !isBlank(min) ? min : max;
    }

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    private static String nullIfBlank(String s) {
        return isBlank(s) ? null : s.trim();
    }
}

