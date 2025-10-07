package pl.ceveme.domain.services.device;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UserAgentBrowser {

    private static final List<Rule> BROWSER_RULES =
            List.of(
                    new Rule("(Edg|EdgA|EdgiOS)/([\\d.]+)", "Edge", 2),
                    new Rule("(OPR)/([\\d.]+)", "Opera", 2),
                    new Rule("(Chrome|CriOS)/([\\d.]+)", "Chrome", 2),
                    new Rule("Version/([\\d.]+).*Safari/[\\d.]+", "Safari", 1),
                    new Rule("Firefox/([\\d.]+)", "Firefox", 1)
            );

    private static final List<DeviceRule> DEVICE_RULES =
            List.of(
                    new DeviceRule("iPad|iPod", "iPad/iPod"),
                    new DeviceRule("iPhone", "iPhone"),

                    new DeviceRule("Android", "Mobile (Android)"),
                    new DeviceRule("Mobile|Tablet", "Mobile (Generic)"),
                    new DeviceRule("Windows Phone", "Mobile (Windows)")
            );


    public static Browser parse(String ua) {
        if (ua == null) return new Browser("Unknown", "", "Unknown");

        String browserName = "Unknown";
        String browserVersion = "";

        for (Rule r : BROWSER_RULES) {
            Matcher m = r.pattern.matcher(ua);
            if (m.find()) {
                browserName = r.name;
                browserVersion = m.group(r.versionGroup);
                break;
            }
        }

        String deviceType = getDeviceType(ua);

        return new Browser(browserName, browserVersion, deviceType);
    }

    public static String getDeviceType(String ua) {
        if (ua == null || ua.isEmpty()) {
            return "Unknown";
        }

        for (DeviceRule r : DEVICE_RULES) {
            if (r.pattern.matcher(ua).find()) {
                return r.deviceType;
            }
        }

        return "Desktop";
    }


    public record Browser(String name, String version, String deviceType) {
    }

    private static final class Rule {
        final Pattern pattern;
        final String name;
        final int versionGroup;

        Rule(String regex, String name, int versionGroup) {
            this.pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
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