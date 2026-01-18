package pl.ceveme.application.database;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ExperienceNormalizer {

    private static final Pattern YEAR_PATTERN = Pattern.compile("(\\d+)(?:\\s*[-–]\\s*(\\d+))?");

    public String normalize(String rawInput) {
        if(rawInput == null || rawInput.isEmpty()) return Seniority.UNKNOWN.name();
        String text = rawInput.toLowerCase();

        if(text.contains("director") || text.contains("dyrektor")) {
            return Seniority.DYREKTOR.name();
        }

        if(text.contains("menedżer")) {
            return Seniority.MANAGER.name();
        }

        if(text.contains("kierownik") || text.contains("head")) {
            return Seniority.KIEROWNIK.name();
        }

        if(text.contains("manager") || text.contains("c-level") && text.contains("prezes")) {
            return Seniority.C_LEVEL.name();
        }

        if(text.contains("expert") || text.contains("ekspert")) {
            return Seniority.EXPERT.name();
        }

        if(text.contains("senior") || text.contains("starszy")) {
            return Seniority.SENIOR.name();
        }
        
        if(text.contains("inter") || text.contains("trainee") || text.contains("staż") || text.contains("praktyki")) {
            return Seniority.INTER.name();
        }

        if(text.contains("mid") || text.contains("regular")) {
            return Seniority.MID.name();
        }

        if(text.contains("junior") || text.contains("młodszy") || text.contains("entry level") || text.contains("assistant") || text.contains("asystent")) {
            return Seniority.JUNIOR.name();
        }

        if(text.contains("pracownik fizyczny")) {
            return Seniority.PRACOWNIK_FIZYCZNY.name();
        }


        if(text.contains("lead")) {
            return Seniority.LEAD.name();
        }


        Matcher matcher = YEAR_PATTERN.matcher(text);
        if(matcher.find()) {
            int minYears = Integer.parseInt(matcher.group(1));

            if(minYears == 0) return Seniority.INTER.name();
            if(minYears == 1) return Seniority.JUNIOR.name();
            if(minYears >= 2 && minYears < 5) return Seniority.MID.name();
            if(minYears >= 5 && minYears <10) return Seniority.SENIOR.name();
            if(minYears >= 10) return Seniority.C_LEVEL.name();
        }

        return Seniority.UNKNOWN.name();
        
     }

}
