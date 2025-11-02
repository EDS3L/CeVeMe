package pl.ceveme.infrastructure.external.email;

public final class EmailTemplates {

    private EmailTemplates() {}

    public static String verificationEmailHtml(String code) {
        return verificationEmailHtml(
                code,
                "#1B64F2",
                "#111827",
                "#F9FAFB"
        );
    }

    public static String verificationEmailHtml(String code,
                                               String primaryColor,
                                               String textColor,
                                               String background) {

        String safeCode = escapeHtml(code);
        String safeBrand = escapeHtml("CeVeMe");

        return "<!doctype html>" +
                "<html lang=\"pl\">" +
                "<head>" +
                "  <meta charset=\"utf-8\">" +
                "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">" +
                "  <title>Kod potwierdzający – CeVeMe </title>" +
                "</head>" +
                "<body style=\"margin:0;padding:0;background:" + background + ";\">" +
                "  <div style=\"display:none;visibility:hidden;opacity:0;height:0;max-height:0;overflow:hidden;mso-hide:all;\">" +
                "    Twój kod potwierdzający do " + safeBrand + ": " + safeCode +
                "  </div>" +

                "  <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"background:" + background + ";\">" +
                "    <tr>" +
                "      <td align=\"center\" style=\"padding:32px 16px;\">" +
                "        <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"max-width:600px;background:#ffffff;border-radius:14px;box-shadow:0 6px 30px rgba(0,0,0,0.06);\">" +
                "          <tr>" +
                "            <td style=\"padding:28px 32px 0 32px;\">" +
                "              <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">" +
                "                <tr>" +
                "                  <td align=\"left\" style=\"font:600 16px/1.4 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;color:" + textColor + ";\">" +
                "                    " + safeBrand +
                "                  </td>" +
                "                  <td align=\"right\">" +
                "                    <span style=\"display:inline-block;width:12px;height:12px;border-radius:50%;background:" + primaryColor + ";\"></span>" +
                "                  </td>" +
                "                </tr>" +
                "              </table>" +
                "              <h1 style=\"margin:20px 0 10px 0;font:700 24px/1.25 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;color:" + textColor + ";\">" +
                "                Potwierdź swój adres e-mail" +
                "              </h1>" +
                "              <p style=\"margin:0 0 18px 0;font:400 15px/1.7 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;color:#4B5563;\">" +
                "                Dziękujemy za rejestrację w <strong style=\"color:" + textColor + ";\">" + safeBrand + "</strong>. " +
                "                Aby dokończyć proces, wpisz poniższy kod w aplikacji." +
                "              </p>" +

                "              <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"margin:18px 0 8px 0;\">" +
                "                <tr>" +
                "                  <td align=\"center\" style=\"padding:18px;border:1px solid #E5E7EB;border-radius:12px;background:#FAFAFA;\">" +
                "                    <div style=\"font:700 28px/1.2 SFMono-Regular,Consolas,Monaco,monospace;letter-spacing:.22em;color:" + textColor + ";\">" +
                "                      " + safeCode +
                "                    </div>" +
                "                  </td>" +
                "                </tr>" +
                "              </table>" +
                "              <p style=\"margin:0 0 22px 0;font:400 14px/1.8 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;color:#6B7280;\">" +
                "                Kod jest jednorazowy i wygasa po 10 minutach. " +
                "                Jeśli to nie Ty inicjowałeś/aś tę operację, zignoruj tę wiadomość." +
                "              </p>" +
                "              <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" style=\"margin:6px 0 28px 0;\">" +
                "                <tr>" +
                "                  <td align=\"center\" style=\"border-radius:10px;background:" + primaryColor + ";\">" +
                "                    <span style=\"display:inline-block;padding:12px 20px;font:600 14px/1.2 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;color:#ffffff;text-decoration:none;\">" +
                "                      Wpisz kod w aplikacji" +
                "                    </span>" +
                "                  </td>" +
                "                </tr>" +
                "              </table>" +

                "              <hr style=\"border:none;border-top:1px solid #EFEFEF;margin:0 0 16px 0;\">" +
                "              <p style=\"margin:0 0 6px 0;font:600 12px/1.6 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;color:#9CA3AF;text-transform:uppercase;letter-spacing:.08em;\">" +
                "                Wiadomość automatyczna — prosimy nie odpowiadać" +
                "              </p>" +
                "              <p style=\"margin:0 0 28px 0;font:400 12px/1.7 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;color:#9CA3AF;\">" +
                "                Jeśli potrzebujesz pomocy, skontaktuj się z naszym zespołem wsparcia." +
                "              </p>" +

                "            </td>" +
                "          </tr>" +
                "        </table>" +
                "      </td>" +
                "    </tr>" +
                "  </table>" +
                "</body></html>";
    }

    private static String escapeHtml(String s) {
        if (s == null) return "";
        StringBuilder out = new StringBuilder(Math.max(16, s.length()));
        for (char c : s.toCharArray()) {
            switch (c) {
                case '&':  out.append("&amp;");  break;
                case '<':  out.append("&lt;");   break;
                case '>':  out.append("&gt;");   break;
                case '\"': out.append("&quot;"); break;
                case '\'': out.append("&#39;");  break;
                default:   out.append(c);
            }
        }
        return out.toString();
    }
}
