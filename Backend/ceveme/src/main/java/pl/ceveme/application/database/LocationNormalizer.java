package pl.ceveme.application.database;

import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.Map;

public class LocationNormalizer {


    public String normalizeCity(String rawInput) {
        if(rawInput == null || rawInput.isEmpty()) return null;


        String clean = rawInput.toLowerCase().trim();
        clean = clean.replaceAll("\\(.*?\\)", " ");
        clean = clean.replaceAll("(?i)(remote|hybrid|zdalnie|hybrydowo|home office|[/\\\\+\\-])", " ").trim();


        while (clean.endsWith(".") || clean.endsWith(",") || clean.endsWith("/")) {
            clean = clean.substring(0, clean.length() - 1).trim();
        }
        while (clean.startsWith(".") || clean.startsWith(",")) {
            clean = clean.substring(1).trim();
        }

        if (clean.endsWith(".") || clean.endsWith(",")) {
            clean = clean.substring(0, clean.length() - 1);
        }

        if (CityMapping.CITY_MAPPING.containsKey(clean)) {
            return CityMapping.CITY_MAPPING.get(clean);
        }

        if (clean.length() < 2) {
            return null;
        }

        return StringUtils.capitalize(clean);

    }


    public boolean isRemote(String rawInput) {
        if (rawInput == null) return false;
        String lower = rawInput.toLowerCase();
        return lower.contains("remote") || lower.contains("zdalnie") ||
                lower.contains("home office") || lower.contains("hybryd");
    }


}
