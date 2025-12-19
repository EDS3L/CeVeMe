package pl.ceveme.infrastructure.external.scrap.linkedin;

import com.fasterxml.jackson.databind.JsonNode;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.vo.Location;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class LinkedinMapper {

    private static final ZoneId ZONE = ZoneId.of("Europe/Warsaw");

    private static final List<String> REQ_HEADINGS_RX = Arrays.asList(
            "(?:nasze\\s+)?oczekiwania",
            "wymagania",
            "wymagamy",
            "kwalifikacje",
            "profil\\s+kandydata",
            "kogo\\s+szukamy",
            "must\\s*\\-?\\s*have",
            "key\\s+requirements?",
            "required\\s+(?:skills?|qualifications?)",
            "your\\s+profile",
            "about\\s+you",
            "what\\s+you(?:'|’)?ll\\s+need",
            "requirements",
            "qualifications"
    );

    private static final List<String> NICE_HEADINGS_RX = Arrays.asList(
            "mile\\s+widziane",
            "dodatkowym?\\s+atutem\\s+będzie",
            "będzie\\s+plusem",
            "preferred\\s+qualifications?",
            "nice\\s*\\-?\\s*to\\s*\\-?\\s*have",
            "good\\s+to\\s+have",
            "optional",
            "bonus\\s+points"
    );

    private static final List<String> BENEFITS_HEADINGS_RX = Arrays.asList(
            "co\\s+oferujemy\\??",
            "oferujemy",
            "benefity",
            "pakiet\\s+benefitów?",
            "we\\s+offer",
            "what\\s+we\\s+offer",
            "perks",
            "what\\s+you\\s+get",
            "what'?s\\s+in\\s+it\\s+for\\s+you"
    );

    private static final List<String> RESPONSIBILITIES_HEADINGS_RX = Arrays.asList(
            "czym\\s+będziesz\\s+się\\s+zajmował(?:\\/-a)?",
            "twoje\\s+zadania",
            "zadania",
            "zakres\\s+(?:obowiązków|zadań)",
            "opis\\s+(?:roli|stanowiska)",
            "what\\s+you(?:'|’)?ll\\s+do",
            "your\\s+responsibilities",
            "role\\s+overview",
            "key\\s+duties",
            "scope",
            "responsibilities",
            "about\\s+the\\s+role"
    );

    private static final List<String> EXPERIENCE_HEADINGS_RX = Arrays.asList(
            "doświadczenie",
            "wymagane\\s+doświadczenie",
            "experience",
            "work\\s+experience",
            "required\\s+experience"
    );

    private static final List<String> LOCATION_HEADINGS_RX = Arrays.asList(
            "miejsce\\s+pracy",
            "lokalizacja",
            "based\\s+in",
            "work\\s+location",
            "place\\s+of\\s+work",
            "location"
    );

    private static final List<String> ALL_HEADINGS_RX = concat(
            REQ_HEADINGS_RX, NICE_HEADINGS_RX, BENEFITS_HEADINGS_RX, RESPONSIBILITIES_HEADINGS_RX, EXPERIENCE_HEADINGS_RX, LOCATION_HEADINGS_RX
    );

    private static final Pattern GDPR_CUTOFF_RX = Pattern.compile("(?isu)(prosimy\\s+o\\s+dopisanie|klauzul[ay]|rodo|gdpr|zgod[ay]|informujemy,\\s*że|administrator\\s+danych|polityka\\s+prywatności|procedur[ay]|whistle\\-?blow|inne\\s+oferty\\s+pracy|aplikuj|cv\\s+na\\s+potrzeby)", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);

    private static final Pattern CITY_NOISE_RX = Pattern.compile("(?iu)\\b(poland|polska|pl|eu|europe|branch|office|hq|hub|center|centre|business\\s+centre|business\\s+center)\\b");
    private static final Pattern REMOTE_RX = Pattern.compile("(?iu)\\b(remote|praca\\s*zdaln\\w+|zdalnie|work\\s*from\\s*home|wfh|hybrid|hybryd\\w+)\\b");
    private static final Pattern CITY_INLINE_RX = Pattern.compile("(?i)\\b(?:w|in|based\\s+in)\\s+([A-ZŻŹĆĄŚĘŁÓŃ][\\p{L}.' -]{2,})(?:,?\\s*(?:Poland|PL))?\\b");

    private static final Pattern SALARY_KEYWORDS_RX = Pattern.compile("(?iu)\\b(salary|compensation|pay|rate|remuneration|wynagrodzenie|stawka|pensja|widełki)\\b");
    private static final Pattern SALARY_MONEY_RX = Pattern.compile("(?iu)(?:[€$£]|\\bpln\\b|\\bzł\\b|\\beur\\b|\\busd\\b|\\bgbp\\b)\\s*\\d[\\d .,'kKtysTYŚ]*");
    private static final Pattern SALARY_AMOUNT_UNIT_RX = Pattern.compile("(?iu)((?:[€$£]\\s*)?\\d{1,3}(?:[.,\\s]\\d{3})*(?:[.,]\\d+)?\\s*(?:k|tys\\.?|t)?\\s*(?:pln|zł|eur|usd|gbp)?)\\s*(?:/|per|na)\\s*(hour|day|month|year|h|d|m|y|godz\\.?|dzień|mies(?:iąc|ięcznie)?|rok|annum)?");
    private static final Pattern SALARY_EXCLUDE_RX = Pattern.compile("(?iu)\\b(%|percent|bonus|allowance|subsidy|budget|refund|do\\s+|up\\s+to)\\b");

    private static final Pattern EXP_RANGE_RX = Pattern.compile("(?iu)(\\d{1,2})\\s*[-–]\\s*(\\d{1,2})\\s*(lat|lata|let|years?|yrs)\\b.{0,20}\\b(experience|doświadczenia|exp)\\b");
    private static final Pattern EXP_MIN_RX = Pattern.compile("(?iu)(?:min(?:imum)?|at\\s+least|co\\s+najmniej|minimum)\\s*(\\d{1,2})\\+?\\s*(lat|lata|let|years?|yrs)\\b.{0,20}\\b(experience|doświadczenia|exp)\\b");
    private static final Pattern EXP_SIMPLE_RX = Pattern.compile("(?iu)\\b(\\d{1,2})\\+?\\s*(lat|lata|let|years?|yrs)\\b.{0,20}\\b(experience|doświadczenia|exp)\\b");
    private static final Pattern EXP_EXCLUDE_MONTHS_RX = Pattern.compile("(?iu)\\b(month|months|mies(?:\\.|ięcy|i[aą]c)?|mth|msc)\\b");
    private static final Pattern EXP_EXCLUDE_NOISE_RX = Pattern.compile("(?iu)\\b\\d+\\s*%|\\d+x|\\d+\\.\\d+\\b");

    public static JobOffer mapToOffer(JsonNode node, String link, String niceToHaveParam, String benefitsParam, LocalDate dateEnding) {
        if (node == null) return null;

        String title = str(node, "title");
        String company = str(path(node, "companyDetails"), "name");
        String description = str(path(node, "description"), "text");

        String employmentType = parseUrnSuffix(str(node, "*employmentStatus"));

        String salary = extractSalary(node);
        if (isBlank(salary)) salary = extractSalaryFromTextStrict(description);

        Location location = extractLocation(node, description);

        LocalDate dateAdded = firstNonNull(
                parseEpoch(strLong(node, "listedAt")),
                parseEpoch(strLong(node, "originalListedAt")),
                parseEpoch(strLong(node, "createdAt"))
        );
        LocalDate dateEnd = dateEnding != null ? dateEnding : parseEpoch(strLong(node, "expireAt"));

        String responsibilities = extractSection(description, RESPONSIBILITIES_HEADINGS_RX, ALL_HEADINGS_RX);
        String requirements = extractSection(description, REQ_HEADINGS_RX, ALL_HEADINGS_RX);
        String niceToHaveAuto = extractSection(description, NICE_HEADINGS_RX, ALL_HEADINGS_RX);
        String benefitsAuto = stripBoilerplate(extractSection(description, BENEFITS_HEADINGS_RX, ALL_HEADINGS_RX));

        String niceToHave = firstNonBlank(cleanParam(niceToHaveParam, title, company), niceToHaveAuto);
        String benefits = firstNonBlank(cleanParam(benefitsParam, title, company), benefitsAuto);

        String experience = extractExperienceStrict(description);

        if (isBlank(employmentType)) employmentType = detectEmploymentTypeStrict(description);

        return new JobOffer(
                link,
                nullIfBlank(trimToMax(title, 140)),
                nullIfBlank(trimToMax(company, 120)),
                nullIfBlank(salary),
                location,
                limitBlock(requirements),
                limitBlock(niceToHave),
                firstNonBlank(limitBlock(responsibilities), limitBlock(description)),
                limitBlock(benefits),
                nullIfBlank(experience),
                nullIfBlank(employmentType),
                dateAdded,
                dateEnd
        );
    }

    private static String cleanParam(String param, String title, String company) {
        if (isBlank(param)) return null;
        String p = param.trim();
        if (!isBlank(company) && p.equalsIgnoreCase(company)) return null;
        if (!isBlank(title) && p.equalsIgnoreCase(title)) return null;
        if (p.length() > 300) return null;
        int punct = p.replaceAll("[^,.;:!?#/\\\\\\-\\n]", "").length();
        if (punct > 12) return null;
        if (p.matches("(?is).*https?://.*")) return null;
        return p;
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
        if (!isBlank(unit)) sb.append(" / ").append(unit.toLowerCase(Locale.ROOT));
        String out = sb.toString().trim();
        if (invalidSalary(out)) return null;
        return out;
    }

    private static boolean invalidSalary(String s) {
        if (isBlank(s)) return true;
        if (SALARY_EXCLUDE_RX.matcher(s).find()) return true;
        return false;
    }

    private static String extractSalaryFromTextStrict(String text) {
        if (isBlank(text)) return null;
        String[] lines = text.split("\\R");
        for (String raw : lines) {
            String line = raw.trim();
            if (line.length() > 220) continue;
            if (!SALARY_KEYWORDS_RX.matcher(line).find()) continue;
            if (SALARY_EXCLUDE_RX.matcher(line).find()) continue;
            Matcher au = SALARY_AMOUNT_UNIT_RX.matcher(line);
            if (au.find()) {
                String amount = au.group(1).replaceAll("\\s{2,}", " ").trim();
                String unit = au.group(2);
                String normalized = !isBlank(unit) ? amount + " / " + normalizeUnit(unit) : amount;
                if (!isBlank(normalized)) return normalized;
            }
            Matcher m = SALARY_MONEY_RX.matcher(line);
            if (m.find() && !SALARY_EXCLUDE_RX.matcher(line).find()) return m.group().trim();
        }
        return null;
    }

    private static String normalizeUnit(String u) {
        String s = u.toLowerCase(Locale.ROOT);
        if (s.startsWith("h") || s.startsWith("godz")) return "hour";
        if (s.startsWith("d") || s.startsWith("dzie")) return "day";
        if (s.startsWith("m")) return "month";
        if (s.startsWith("y") || s.startsWith("rok") || s.contains("annum")) return "year";
        return u;
    }

    private static Location extractLocation(JsonNode n, String description) {
        String formatted = str(n, "formattedLocation");
        if (!isBlank(formatted)) {
            String candidate = firstSegment(formatted);
            String city = sanitizeCity(candidate);
            if (!isBlank(city)) return new Location(city, null);
        }
        JsonNode addr = path(n, "jobLocation", "address");
        if (addr != null && addr.isObject()) {
            String city = sanitizeCity(str(addr, "addressLocality"));
            String street = sanitizeStreet(str(addr, "streetAddress"));
            if (!isBlank(city) || !isBlank(street)) return new Location(nullIfBlank(city), nullIfBlank(street));
        }
        if (!isBlank(description)) {
            Matcher mh = Pattern.compile("(?iu)miejsce\\s*pracy\\s*[:\\-]\\s*([^\\n]+)").matcher(description);
            if (mh.find()) {
                String raw = firstSegment(mh.group(1).trim());
                String city = sanitizeCity(raw);
                String street = null;
                if (!isBlank(city)) {
                    street = guessStreetAfterCity(raw, city);
                    return new Location(city, street);
                }
            }
            Matcher cityOnly = CITY_INLINE_RX.matcher(description);
            if (cityOnly.find()) {
                String city = sanitizeCity(cityOnly.group(1).trim());
                if (!isBlank(city)) return new Location(city, null);
            }
            if (Pattern.compile("(?iu)\\bPoland|Polska\\b").matcher(description).find()) {
                if (REMOTE_RX.matcher(description).find()) return new Location("Remote/Hybrid", null);
                return new Location("Poland", null);
            }
            if (REMOTE_RX.matcher(description).find()) return new Location("Remote/Hybrid", null);
        }
        return null;
    }

    private static String firstSegment(String s) {
        if (isBlank(s)) return null;
        String noParen = s.replaceAll("\\s*\\(.*?\\)\\s*", " ").trim();
        String[] split = noParen.split("\\s*[,|/;•\\-–—]\\s*");
        return split.length > 0 ? split[0].trim() : noParen.trim();
    }

    private static String guessStreetAfterCity(String full, String city) {
        if (isBlank(full) || isBlank(city)) return null;
        String after = full.replaceFirst("^\\s*" + Pattern.quote(city) + "\\s*", "").trim();
        if (after.isEmpty()) return null;
        if (after.length() > 80) return null;
        if (!Pattern.compile("(?iu)\\b(ul\\.|ulica|al\\.|aleja|aleje|street|st\\.|avenue|ave\\.|bulwar|plac|pl\\.)\\b|\\d").matcher(after).find())
            return null;
        return after.replaceAll("\\s*[,|/;•]\\s*.*$", "").trim();
    }

    private static String sanitizeCity(String s) {
        if (isBlank(s)) return null;
        String x = s.trim();
        x = x.replaceAll("\\s*\\(.*?\\)\\s*", " ").trim();
        x = CITY_NOISE_RX.matcher(x).replaceAll("").trim();
        x = x.replaceAll("\\s{2,}", " ").trim();
        if (x.length() > 40) x = x.replaceAll("\\s*[,|/;•\\-–—]\\s*.*$", "").trim();
        if (x.length() > 40) return null;
        if (x.matches(".*\\d.*")) return null;
        int words = x.split("\\s+").length;
        if (words > 3) return null;
        if (!x.matches("(?u)[\\p{Lu}].*")) return null;
        if (!x.matches("(?u)[\\p{L} .\\-']{2,}")) return null;
        return x.isEmpty() ? null : x;
    }

    private static String sanitizeStreet(String s) {
        if (isBlank(s)) return null;
        String x = s.trim();
        if (!Pattern.compile("(?iu)\\b(ul\\.|ulica|al\\.|aleja|aleje|street|st\\.|avenue|ave\\.|bulwar|plac|pl\\.)\\b|\\d").matcher(x).find())
            return null;
        if (x.length() > 80) x = x.substring(0, 80).trim();
        return x;
    }

    private static String extractSection(String text, List<String> targetHeadingsRx, List<String> allHeadingsRx) {
        if (isBlank(text)) return null;
        String h1 = sectionsAlt(targetHeadingsRx);
        String hall = sectionsAlt(allHeadingsRx);
        Pattern p = Pattern.compile("(?isu)(?:^|\\R)\\s*(?:[\\p{So}\\p{Sk}\\p{Punct}]\\s*)*(?:" + h1 + ")\\s*[:\\-–—•»]*\\s*(.*?)(?=(?:\\R\\s*(?:[\\p{So}\\p{Sk}\\p{Punct}]\\s*)*(?:" + hall + ")\\s*[:\\-–—•»]*\\s*)|\\z)");
        Matcher m = p.matcher(text);
        if (m.find()) {
            String block = m.group(1).trim();
            block = stripBoilerplate(block);
            block = normalizeBullets(block);
            return nullIfBlank(block);
        }
        return null;
    }

    private static String stripBoilerplate(String block) {
        if (isBlank(block)) return block;
        Matcher cut = GDPR_CUTOFF_RX.matcher(block);
        if (cut.find()) return block.substring(0, cut.start()).trim();
        return block;
    }

    private static String normalizeBullets(String block) {
        if (isBlank(block)) return null;
        String b = block.replaceAll("(?m)^[\\s•*\\-–·▹▶▪●]+", "• ").replaceAll("\\r", "");
        b = b.replaceAll("(?m)^(\\d+)\\.(\\s+)", "$1. $2");
        b = b.replaceAll("\\n{3,}", "\n\n").trim();
        b = b.replaceAll("(?m)\\s{2,}", " ").trim();
        return b;
    }

    private static String extractExperienceStrict(String text) {
        if (isBlank(text)) return null;
        String sec = extractSection(text, EXPERIENCE_HEADINGS_RX, ALL_HEADINGS_RX);
        String fromSec = parseExperienceFromText(sec);
        if (!isBlank(fromSec)) return fromSec;
        return parseExperienceFromText(text);
    }

    private static String parseExperienceFromText(String text) {
        if (isBlank(text)) return null;
        if (EXP_EXCLUDE_NOISE_RX.matcher(text).find() && !text.matches("(?iu).*\\b(experience|doświadczenia|exp)\\b.*")) { }
        Matcher mr = EXP_RANGE_RX.matcher(text);
        if (mr.find()) {
            int a = parseInt(mr.group(1)), b = parseInt(mr.group(2));
            if (a <= 40 && b <= 40 && a > 0 && b >= a) return a + "–" + b + " years";
        }
        Matcher mm = EXP_MIN_RX.matcher(text);
        if (mm.find()) {
            int a = parseInt(mm.group(1));
            if (a > 0 && a <= 40 && !EXP_EXCLUDE_MONTHS_RX.matcher(text).find()) return a + "+ years";
        }
        Matcher ma = EXP_SIMPLE_RX.matcher(text);
        if (ma.find()) {
            int a = parseInt(ma.group(1));
            if (a > 0 && a <= 40 && !EXP_EXCLUDE_MONTHS_RX.matcher(text).find()) return a + " years";
        }
        return null;
    }

    private static String detectEmploymentTypeStrict(String text) {
        if (isBlank(text)) return null;
        String t = text.toLowerCase(Locale.ROOT);
        boolean contract = Pattern.compile("\\b(b2b|kontrakt|contractor|contract\\b|umowa\\s+zlecenie|umowa\\s+o\\s+dzieło)\\b").matcher(t).find();
        boolean full = Pattern.compile("\\b(uop|umowa\\s+o\\s+pracę|full[- ]?time|permanent|etat|pełny\\s+etat)\\b").matcher(t).find();
        boolean part = Pattern.compile("\\b(part[- ]?time|niepełny\\s+etat|0\\.?[1-9]\\s*etatu)\\b").matcher(t).find();
        int count = (contract ? 1 : 0) + (full ? 1 : 0) + (part ? 1 : 0);
        if (count != 1) return null;
        if (contract) return "CONTRACT";
        if (full) return "FULL_TIME";
        if (part) return "PART_TIME";
        return null;
    }

    private static String parseUrnSuffix(String urn) {
        if (isBlank(urn)) return null;
        int idx = urn.lastIndexOf(':');
        if (idx >= 0 && idx + 1 < urn.length()) return urn.substring(idx + 1);
        return urn;
    }

    private static LocalDate parseEpoch(Long epochMillis) {
        if (epochMillis == null || epochMillis <= 0) return null;
        return Instant.ofEpochMilli(epochMillis).atZone(ZONE).toLocalDate();
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

    private static List<String> concat(List<String>... lists) {
        List<String> out = new ArrayList<>();
        for (List<String> l : lists) out.addAll(l);
        return out;
    }

    private static String sectionsAlt(List<String> rx) {
        return String.join("|", rx);
    }

    private static int parseInt(String s) {
        try { return Integer.parseInt(s); } catch (Exception e) { return -1; }
    }

    private static String trimToMax(String s, int max) {
        if (s == null) return null;
        String t = s.trim();
        if (t.length() <= max) return t;
        return t.substring(0, max).trim();
    }

    private static String limitBlock(String s) {
        if (isBlank(s)) return null;
        String t = s.trim();
        if (t.length() > 3000) t = t.substring(0, 3000).trim();
        return t;
    }
}
