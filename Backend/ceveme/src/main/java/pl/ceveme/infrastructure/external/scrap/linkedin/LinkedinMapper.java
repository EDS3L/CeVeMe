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

    private static final List<String> REQ_HEADINGS_RX = Arrays.asList(
            "(?:nasze\\s+)?oczekiwania",
            "wymagania",
            "wymagamy",
            "kwalifikacje",
            "profil\\s+kandydata",
            "kogo\\s+szukamy",
            "what\\s+you(?:'|’)ll\\s+need",
            "requirements",
            "qualifications"
    );
    private static final List<String> NICE_HEADINGS_RX = Arrays.asList(
            "mile\\s+widziane",
            "dodatkowym?\\s+atutem\\s+będzie",
            "będzie\\s+plusem",
            "preferred\\s+qualifications",
            "nice\\s+to\\s+have",
            "optional",
            "bonus\\s+points"
    );
    private static final List<String> BENEFITS_HEADINGS_RX = Arrays.asList(
            "co\\s+oferujemy\\??",
            "oferujemy",
            "benefity",
            "pakiet\\s+benefitów?",
            "we\\s+offer",
            "perks",
            "what\\s+we\\s+offer"
    );
    private static final List<String> RESPONSIBILITIES_HEADINGS_RX = Arrays.asList(
            "czym\\s+będziesz\\s+się\\s+zajmował(?:\\/-a)?",
            "twoje\\s+zadania",
            "zadania",
            "zakres\\s+(?:obowiązków|zadań)",
            "opis\\s+(?:roli|stanowiska)",
            "what\\s+you(?:'|’)ll\\s+do",
            "responsibilities",
            "about\\s+the\\s+role"
    );
    private static final List<String> EXPERIENCE_HEADINGS_RX = Arrays.asList(
            "doświadczenie",
            "wymagane\\s+doświadczenie",
            "experience",
            "work\\s+experience"
    );
    private static final List<String> LOCATION_HEADINGS_RX = Arrays.asList(
            "miejsce\\s+pracy",
            "lokalizacja",
            "based\\s+in",
            "work\\s+location",
            "place\\s+of\\s+work"
    );

    private static final List<String> ALL_HEADINGS_RX = concat(
            REQ_HEADINGS_RX, NICE_HEADINGS_RX, BENEFITS_HEADINGS_RX, RESPONSIBILITIES_HEADINGS_RX, EXPERIENCE_HEADINGS_RX, LOCATION_HEADINGS_RX
    );

    private static final Pattern GDPR_CUTOFF_RX = Pattern.compile("(?isu)(prosimy\\s+o\\s+dopisanie|klauzul[ay]|rodo|gdpr|zgod[ay]|informujemy,\\s*że|administrator\\s+danych|polityka\\s+prywatności|procedur[ay]|whistle\\-?blow|inne\\s+oferty\\s+pracy|aplikuj|cv\\s+na\\s+potrzeby)", Pattern.CASE_INSENSITIVE|Pattern.UNICODE_CASE);

    public static JobOffer mapToOffer(JsonNode node,
                                      String link,
                                      String niceToHaveParam,
                                      String benefitsParam,
                                      LocalDate dateEnding) {
        if (node == null) return null;

        String title = str(node, "title");
        String company = str(path(node, "companyDetails"), "name");

        String description = str(path(node, "description"), "text");

        String employmentType = parseUrnSuffix(str(node, "*employmentStatus"));

        String salary = extractSalary(node);
        if (isBlank(salary)) salary = extractSalaryFromText(description);

        Location location = extractLocation(node);
        if (location == null) location = extractLocationFromDescription(description);

        LocalDate dateAdded = firstNonNull(
                parseEpoch(strLong(node, "listedAt")),
                parseEpoch(strLong(node, "originalListedAt")),
                parseEpoch(strLong(node, "createdAt"))
        );

        LocalDate dateEnd = dateEnding != null ? dateEnding : parseEpoch(strLong(node, "expireAt"));

        String responsibilities = extractSection(description, RESPONSIBILITIES_HEADINGS_RX, ALL_HEADINGS_RX);
        String requirements = extractSection(description, REQ_HEADINGS_RX, ALL_HEADINGS_RX);
        String niceToHaveAuto = extractSection(description, NICE_HEADINGS_RX, ALL_HEADINGS_RX);
        String benefitsAuto = extractSection(description, BENEFITS_HEADINGS_RX, ALL_HEADINGS_RX);
        benefitsAuto = stripBoilerplate(benefitsAuto);

        String niceToHave = firstNonBlank(cleanParam(niceToHaveParam, title, company), niceToHaveAuto);
        String benefits = firstNonBlank(cleanParam(benefitsParam, title, company), benefitsAuto);

        String experience = extractExperience(description);
        if (isBlank(employmentType)) employmentType = detectEmploymentType(description);

        return new JobOffer(
                link,
                nullIfBlank(title),
                nullIfBlank(company),
                nullIfBlank(salary),
                location,
                requirements,
                niceToHave,
                firstNonBlank(responsibilities, description),
                benefits,
                experience,
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
        return sb.toString();
    }

    private static String extractSalaryFromText(String text) {
        if (isBlank(text)) return null;
        Pattern lineWithSalary = Pattern.compile("(?im)^(?=.*\\b(?:salary|compensation|pay|rate|remuneration|wynagrodzenie|stawka|pensja|widełki)\\b).{1,160}$");
        Matcher lm = lineWithSalary.matcher(text);
        if (lm.find()) {
            String line = lm.group().trim();
            String parsed = parseAmountAndUnit(line);
            return nullIfBlank(parsed != null ? parsed : line);
        }
        Pattern anyMoney = Pattern.compile("(?i)(?:[€$£]|\\bpln\\b|\\bzł\\b|\\beur\\b|\\busd\\b|\\bgbp\\b)\\s*\\d[\\d .,'kKtysTYŚ]*");
        Matcher m = anyMoney.matcher(text);
        if (m.find()) return m.group().trim();
        return null;
    }

    private static String parseAmountAndUnit(String line) {
        Pattern au = Pattern.compile("(?i)((?:[€$£]\\s*)?\\d{1,3}(?:[.,\\s]\\d{3})*(?:[.,]\\d+)?\\s*(?:k|tys\\.?|t)?\\s*(?:pln|zł|eur|usd|gbp)?)\\s*(?:/|per|na)\\s*(hour|day|month|year|h|d|m|y|godz\\.?|dzień|mies(?:iąc|ięcznie)?|rok|annum)?");
        Matcher m = au.matcher(line);
        if (m.find()) {
            String amount = m.group(1).replaceAll("\\s{2,}", " ").trim();
            String unit = m.group(2);
            return !isBlank(unit) ? amount + " / " + normalizeUnit(unit) : amount;
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

    private static Location extractLocationFromDescription(String text) {
        if (isBlank(text)) return null;
        Matcher mh = Pattern.compile("(?iu)miejsce\\s*pracy\\s*[:\\-]\\s*([^\\n]+)").matcher(text);
        if (mh.find()) {
            String raw = mh.group(1).trim();
            String[] slashSplit = raw.split("\\s*/\\s*", 2);
            String left = slashSplit[0];
            String city = left.replaceAll("\\s*\\.+\\s*.*$", "").trim();
            String street = null;
            Matcher st = Pattern.compile("(?iu)\\b(ul\\.|ulica|al\\.|aleja|aleje|al\\b|al\\.|al\\s)|\\d").matcher(left);
            if (st.find()) {
                String afterCity = left.replaceFirst("^" + Pattern.quote(city) + "\\.?\\s*", "");
                street = afterCity.replaceAll("\\s*/.*$", "").trim();
                if (street.isEmpty()) street = null;
            }
            return new Location(nullIfBlank(city), nullIfBlank(street));
        }
        Matcher remote = Pattern.compile("(?i)\\b(remote|praca\\s+zdalna|zdalnie|work\\s+from\\s+home|wfh|hybrydowo)\\b").matcher(text);
        if (remote.find()) return new Location("Remote/Hybrid", null);
        Matcher cityOnly = Pattern.compile("(?i)\\b(?:w|in|based\\s+in)\\s+([A-ZŻŹĆĄŚĘŁÓŃ][\\p{L}.' -]{2,})(?:,?\\s*Poland|,?\\s*PL)?\\b").matcher(text);
        if (cityOnly.find()) return new Location(cityOnly.group(1).trim(), null);
        Matcher country = Pattern.compile("(?i)\\bPoland|Polska\\b").matcher(text);
        if (country.find()) return new Location("Poland", null);
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

    private static List<String> concat(List<String>... lists) {
        List<String> out = new ArrayList<>();
        for (List<String> l : lists) out.addAll(l);
        return out;
    }

    private static String sectionsAlt(List<String> rx) {
        return String.join("|", rx);
    }

    private static String normalizeBullets(String block) {
        String b = block.replaceAll("(?m)^[\\s•*\\-–·▹▶▪●]+", "• ").replaceAll("\\r", "");
        b = b.replaceAll("\\n{3,}", "\n\n").trim();
        b = b.replaceAll("(?m)\\s{2,}", " ").trim();
        return b;
    }

    private static String extractSection(String text, List<String> targetHeadingsRx, List<String> allHeadingsRx) {
        if (isBlank(text)) return null;
        String h1 = sectionsAlt(targetHeadingsRx);
        String hall = sectionsAlt(allHeadingsRx);
        Pattern p = Pattern.compile("(?isu)(?:^|\\R)\\s*(?:" + h1 + ")\\s*[:\\-–?]*\\s*(.*?)(?=(?:\\R\\s*(?:" + hall + ")\\s*[:\\-–?]*\\s*)|\\z)");
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

    private static String extractExperience(String text) {
        if (isBlank(text)) return null;
        Matcher mr = Pattern.compile("(?iu)(\\d{1,2})\\s*[-–]\\s*(\\d{1,2})\\s*(?:years|year|yrs|lat|lata|let)\\s*(?:of)?\\s*(?:experience|exp|doświadczenia)?").matcher(text);
        if (mr.find()) return mr.group(1) + "–" + mr.group(2) + " years";
        Matcher mm = Pattern.compile("(?iu)(?:min(?:imum)?|at\\s+least|co\\s+najmniej|minimum)\\s*(\\d{1,2})\\+?\\s*(?:years|year|yrs|lat|lata|let)\\s*(?:of)?\\s*(?:experience|exp|doświadczenia)?").matcher(text);
        if (mm.find()) return mm.group(1) + "+ years";
        Matcher ma = Pattern.compile("(?iu)(\\d{1,2})\\+?\\s*(?:years|year|yrs|lat|lata|let)\\s*(?:of)?\\s*(?:experience|exp|doświadczenia)").matcher(text);
        if (ma.find()) return ma.group(1) + " years";
        String sec = extractSection(text, EXPERIENCE_HEADINGS_RX, ALL_HEADINGS_RX);
        return nullIfBlank(sec);
    }

    private static String detectEmploymentType(String text) {
        if (isBlank(text)) return null;
        String t = text.toLowerCase(Locale.ROOT);
        if (t.contains("b2b") || t.contains("contract") || t.contains("kontrakt") || t.contains("umowa zlecenie") || t.contains("umowa o dzieło")) return "CONTRACT";
        if (t.contains("pełny etat") || t.contains("full-time") || t.contains("full time") || t.contains("permanent") || t.contains("etat")) return "FULL_TIME";
        if (t.contains("part-time") || t.contains("part time") || t.contains("część etatu") || t.contains("niepełny etat")) return "PART_TIME";
        return null;
    }
}
