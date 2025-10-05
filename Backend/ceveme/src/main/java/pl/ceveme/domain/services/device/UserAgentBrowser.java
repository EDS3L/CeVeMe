package pl.ceveme.domain.services.device;

import jakarta.persistence.Embeddable;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UserAgentBrowser {
    private static final List<Rule> RULES =
            List.of(
                    new Rule("(Edg|EdgA|EdgiOS)/([\\d.]+)", "Edge", 2),
                    new Rule("(OPR)/([\\d.]+)", "Opera", 2),
                    new Rule("(Chrome|CriOS)/([\\d.]+)", "Chrome", 2),
                    new Rule("Version/([\\d.]+).*Safari/[\\d.]+", "Safari", 1),
                    new Rule("Firefox/([\\d.]+)", "Firefox", 1)
            );

    public static Browser parse(String ua) {
        if (ua == null) return new Browser("Unknown", "");
        for (Rule r : RULES) {
            Matcher m = r.pattern.matcher(ua);
            if (m.find()) {
                return new Browser(r.name, m.group(r.versionGroup));
            }
        }
        return new Browser("Unknown", "");
    }
    @Embeddable
    public record Browser(String name, String version) {
    }

    private static final class Rule {
        final Pattern pattern;
        final String name;
        final int versionGroup;

        Rule(String regex, String name, int versionGroup) {
            this.pattern = Pattern.compile(regex);
            this.name = name;
            this.versionGroup = versionGroup;
        }
    }

}
