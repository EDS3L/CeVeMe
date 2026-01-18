package pl.ceveme.application.database;

import org.springframework.util.StringUtils;
import pl.ceveme.domain.model.enums.SalaryType;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class SalaryNormalizer {
    public ParsedSalary normalize(String raw) {
        if (!StringUtils.hasText(raw)) return new ParsedSalary(null, null, null, SalaryType.UNKNOWN);

        String text = raw.toLowerCase()
                .replace("\u00A0", "")
                .replace(" ", "")
                .replace(",", ".");

        text = text.replaceAll("b2b", "");
        text = text.replaceAll("24/7", "");


        String currency = "PLN";
        if (text.contains("eur") || text.contains("€")) currency = "EUR";
        else if (text.contains("usd") || text.contains("$")) currency = "USD";
        else if (text.contains("gbp") || text.contains("£")) currency = "GBP";

        boolean isExplicitlyHourly = text.contains("/h") || text.contains("godz") || text.contains("hourly");

        Pattern pattern = Pattern.compile("(\\d+(\\.\\d+)?)(k)?");
        Matcher matcher = pattern.matcher(text);

        List<Double> numbers = new ArrayList<>();

        while (matcher.find()) {
            try {
                double val = Double.parseDouble(matcher.group(1));
                if ("k".equals(matcher.group(3))) {
                    val *= 1000;
                }
                numbers.add(val);
            } catch (NumberFormatException ignored) {}
        }

        if (numbers.isEmpty()) {
            return new ParsedSalary(null, null, null, SalaryType.UNKNOWN);
        }

        Collections.sort(numbers);

        Double min = numbers.get(0);
        Double max = numbers.get(numbers.size() - 1);

        if (max > 1000 && min < 20) {
            numbers.removeIf(n -> n < 20);
            if (!numbers.isEmpty()) {
                min = numbers.get(0);
            }
        }

        SalaryType type = SalaryType.MONTHLY;

        if (isExplicitlyHourly) {
            type = SalaryType.HOURLY;
        } else {
            if (max < 600) {
                type = SalaryType.HOURLY;
            }
        }

        return new ParsedSalary(min, max, currency, type);
    }
}
