package pl.ceveme.domain.services.device;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UserAgentBrowser {

    private static final List<Rule> BROWSER_RULES = List.of(
            new Rule("(Edg|EdgA|EdgiOS)/([\\d.]+)", "Edge", 2),
            new Rule("(OPR|Opera)/([\\d.]+)", "Opera", 2),
            new Rule("(SamsungBrowser)/([\\d.]+)", "Samsung Internet", 2),
            new Rule("(Brave)/([\\d.]+)", "Brave", 2),
            new Rule("(Chrome|CriOS)/([\\d.]+)", "Chrome", 2),
            new Rule("Version/([\\d.]+).*Safari/[\\d.]+", "Safari", 1),
            new Rule("Firefox/([\\d.]+)", "Firefox", 1),
            new Rule("(MSIE) ([\\d.]+)", "Internet Explorer", 2),
            new Rule("Trident/.*rv:([\\d.]+)", "Internet Explorer", 1)
    );

    private static final List<DeviceRule> DEVICE_RULES = List.of(
            new DeviceRule("iPad|iPod", "Tablet"),
            new DeviceRule("iPhone", "Mobile"),
            new DeviceRule("Android.*Mobile", "Mobile"),
            new DeviceRule("Android", "Tablet"),
            new DeviceRule("Windows Phone", "Mobile"),
            new DeviceRule("Tablet", "Tablet"),
            new DeviceRule("Mobile", "Mobile"),
            new DeviceRule("Bot|Crawler|Spider|Robot|Slurp", "Bot")
    );

    /**
     * Main parsing method
     */
    public static Browser parse(String ua) {
        if (ua == null || ua.isEmpty()) return new Browser("Unknown", "", "Unknown");

        String browserName = "Unknown";
        String browserVersion = "";

        for (Rule rule : BROWSER_RULES) {
            Matcher matcher = rule.pattern.matcher(ua);
            if (matcher.find()) {
                browserName = rule.name;
                browserVersion = matcher.group(rule.versionGroup);
                break;
            }
        }


        if ("Unknown".equals(browserName)) {
            if (ua.contains("Chrome")) browserName = "Chrome";
            else if (ua.contains("Safari")) browserName = "Safari";
            else if (ua.contains("Firefox")) browserName = "Firefox";
            else if (ua.contains("Edg")) browserName = "Edge";
            else if (ua.contains("OPR")) browserName = "Opera";
            else if (ua.contains("Brave")) browserName = "Brave";
            else if (ua.contains("SamsungBrowser")) browserName = "Samsung Internet";
        }

        String deviceType = getDeviceType(ua);

        return new Browser(browserName, browserVersion.isEmpty() ? "Unknown" : browserVersion, deviceType);
    }

    /**
     * Detect device type
     */
    public static String getDeviceType(String ua) {
        if (ua == null || ua.isEmpty()) return "Unknown";

        for (DeviceRule rule : DEVICE_RULES) {
            if (rule.pattern.matcher(ua).find()) {
                return rule.deviceType;
            }
        }

        return "Desktop";
    }

    /**
     * Browser info record
     */
    public record Browser(String name, String version, String deviceType) {}

    private static final class Rule {
        final Pattern pattern;
        final String name;
        final int versionGroup;

        Rule(String regex, String name, int versionGroup) {
            this.pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
            this.name = name;
            this.versionGroup = versionGroup;
        }
    }

    private static final class DeviceRule {
        final Pattern pattern;
        final String deviceType;

        DeviceRule(String regex, String deviceType) {
            this.pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
            this.deviceType = deviceType;
        }
    }
}
