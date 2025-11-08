package pl.ceveme.domain.services.jobOffer;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class SalaryParser {

    private static final int WORKING_DAYS_PER_MONTH = 21;
    private static final int HOURS_PER_DAY = 8;

    private static final BigDecimal HOURLY_THRESHOLD_PLN = new BigDecimal("300");
    private static final BigDecimal DAY_MIN_PLN = new BigDecimal("300");
    private static final BigDecimal DAY_MAX_PLN = new BigDecimal("2000");

    private final Map<Currency, BigDecimal> fx = Map.of(
            Currency.PLN, BigDecimal.ONE,
            Currency.USD, new BigDecimal("4.00"),
            Currency.EUR, new BigDecimal("4.30")
    );

    private static final Pattern CURRENCY = Pattern.compile("(?iu)(PLN|zł|USD|EUR)");
    private static final Pattern PERIOD = Pattern.compile("(?iu)(?:/\\s*(h|hour|godz|hr)|/\\s*(day|doba|dzien|dzień|md|man\\s*-?\\s*day)|/\\s*(month|mies|miesi[aą]c))");
    private static final Pattern RANGE = Pattern.compile("(?iu)(?:od\\s+)?(?<min>\\d[\\dkK\\s,.]*)\\s*(?:PLN|zł|USD|EUR)?\\s*(?:-|–|—|to|do)\\s*(?<max>\\d[\\dkK\\s,.]*)");
    private static final Pattern SINGLE = Pattern.compile("(?iu)(?<val>\\d[\\dkK\\s,.]*)\\s*(PLN|zł|USD|EUR)(?:\\s*/\\s*(h|hour|godz|hr|day|doba|dzien|dzień|md|man\\s*-?\\s*day|month|mies|miesi[aą]c))?");
    private static final Pattern HINT_HOUR = Pattern.compile("(?iu)\\b(h|hour|godz|per\\s*hour)\\b");
    private static final Pattern HINT_DAY = Pattern.compile("(?iu)\\b(day|doba|dzien|dzień|md|man\\s*-?\\s*day|per\\s*day)\\b");
    private static final Pattern HINT_MONTH = Pattern.compile("(?iu)\\b(month|mies|miesi[aą]c|per\\s*month)\\b");

    public SalaryInfo parse(String raw) {
        if (raw == null) return new SalaryInfo(null, null, Currency.UNKNOWN, PayPeriod.UNKNOWN, null, null);

        String s = raw.replace('\u00A0', ' ')
                .replaceAll("(?iu)umowa.*?:", "")
                .replaceAll("(?iu)kontrakt\\s*B2B:?", "")
                .replaceAll("(?iu)B2B\\s*contract:?", "")
                .trim();

        Matcher mRange = RANGE.matcher(s);
        Matcher mSingle = SINGLE.matcher(s);

        BigDecimal min = null, max = null;
        Currency curr = detectCurrency(s);
        PayPeriod per = detectPeriod(s);

        if (mRange.find()) {
            min = toNumber(mRange.group("min"));
            max = toNumber(mRange.group("max"));
        } else if (mSingle.find()) {
            min = toNumber(mSingle.group("val"));
            max = min;
            curr = curr == Currency.UNKNOWN ? mapCurrency(mSingle.group(2)) : curr;
            per = per == PayPeriod.UNKNOWN ? mapPeriod(mSingle.group(3)) : per;
        }

        if (min != null && raw.matches("(?iu).*od\\s*null.*")) min = null;
        if (max != null && raw.matches("(?iu).*do\\s*null.*")) max = null;

        if (per == PayPeriod.UNKNOWN) per = guessPeriod(s);

        SalaryInfo info = new SalaryInfo(min, max, curr, per, null, null);

        applyHeuristics(info);

        normalizeToMonthlyPln(info);
        return info;
    }

    private void applyHeuristics(SalaryInfo info) {
        BigDecimal rate = fx.getOrDefault(info.currency, BigDecimal.ONE);
        BigDecimal minPln = info.min != null ? info.min.multiply(rate) : null;
        BigDecimal maxPln = info.max != null ? info.max.multiply(rate) : null;

        if (info.period == PayPeriod.UNKNOWN) {
            boolean small =
                    (minPln != null && minPln.compareTo(HOURLY_THRESHOLD_PLN) <= 0) ||
                            (maxPln != null && maxPln.compareTo(HOURLY_THRESHOLD_PLN) <= 0);
            if (small) {
                info.period = PayPeriod.HOUR;
                return;
            }
            boolean dayLike =
                    inRange(minPln, DAY_MIN_PLN, DAY_MAX_PLN) ||
                            inRange(maxPln, DAY_MIN_PLN, DAY_MAX_PLN);
            if (dayLike) {
                info.period = PayPeriod.DAY;
                return;
            }
            info.period = PayPeriod.MONTH;
        }
    }

    private boolean inRange(BigDecimal v, BigDecimal lo, BigDecimal hi) {
        if (v == null) return false;
        return v.compareTo(lo) >= 0 && v.compareTo(hi) <= 0;
    }

    private Currency detectCurrency(String s) {
        Matcher m = CURRENCY.matcher(s);
        if (m.find()) return mapCurrency(m.group(1));
        return Currency.UNKNOWN;
    }

    private Currency mapCurrency(String c) {
        if (c == null) return Currency.UNKNOWN;
        c = c.toUpperCase(Locale.ROOT);
        if (c.contains("PLN") || c.contains("ZŁ")) return Currency.PLN;
        if (c.contains("USD")) return Currency.USD;
        if (c.contains("EUR")) return Currency.EUR;
        return Currency.UNKNOWN;
    }

    private PayPeriod detectPeriod(String s) {
        Matcher m = PERIOD.matcher(s);
        if (m.find()) {
            String g = m.group(1);
            if (g != null) return PayPeriod.HOUR;
            g = m.group(2);
            if (g != null) return PayPeriod.DAY;
            g = m.group(3);
            if (g != null) return PayPeriod.MONTH;
        }
        if (HINT_HOUR.matcher(s).find()) return PayPeriod.HOUR;
        if (HINT_DAY.matcher(s).find()) return PayPeriod.DAY;
        if (HINT_MONTH.matcher(s).find()) return PayPeriod.MONTH;
        return PayPeriod.UNKNOWN;
    }

    private PayPeriod mapPeriod(String p) {
        if (p == null) return PayPeriod.UNKNOWN;
        p = p.toLowerCase(Locale.ROOT).trim();
        if (p.startsWith("h") || p.startsWith("godz") || p.startsWith("hr")) return PayPeriod.HOUR;
        if (p.startsWith("day") || p.startsWith("doba") || p.startsWith("dzie") || p.equals("md") || p.contains("man")) return PayPeriod.DAY;
        if (p.startsWith("month") || p.startsWith("mies")) return PayPeriod.MONTH;
        return PayPeriod.UNKNOWN;
    }

    private PayPeriod guessPeriod(String s) {
        if (HINT_HOUR.matcher(s).find()) return PayPeriod.HOUR;
        if (HINT_DAY.matcher(s).find()) return PayPeriod.DAY;
        if (HINT_MONTH.matcher(s).find()) return PayPeriod.MONTH;
        return PayPeriod.MONTH;
    }

    private BigDecimal toNumber(String raw) {
        if (raw == null) return null;
        String clean = raw.replaceAll("\\s", "").toLowerCase(Locale.ROOT);
        boolean hasK = clean.endsWith("k");
        if (hasK) clean = clean.substring(0, clean.length() - 1);
        clean = clean.replace(",", ".");
        try {
            BigDecimal v = new BigDecimal(clean);
            if (hasK) v = v.multiply(BigDecimal.valueOf(1000));
            return v.setScale(2, RoundingMode.HALF_UP);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private void normalizeToMonthlyPln(SalaryInfo info) {
        if (info.min == null && info.max == null) return;

        BigDecimal rate = fx.getOrDefault(info.currency, null);
        if (rate == null) return;

        BigDecimal factor = null;
        switch (info.period) {
            case HOUR -> factor = BigDecimal.valueOf(WORKING_DAYS_PER_MONTH * HOURS_PER_DAY);
            case DAY -> factor = BigDecimal.valueOf(WORKING_DAYS_PER_MONTH);
            case MONTH, UNKNOWN -> factor = BigDecimal.ONE;
        }

        if (info.min != null) info.minMonthlyPln = info.min.multiply(factor).multiply(rate);
        if (info.max != null) info.maxMonthlyPln = info.max.multiply(factor).multiply(rate);
    }
}
