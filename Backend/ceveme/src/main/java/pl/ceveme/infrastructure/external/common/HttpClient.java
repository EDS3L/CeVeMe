package pl.ceveme.infrastructure.external.common;

import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.impl.DefaultHttpRequestRetryStrategy;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.HttpHeaders;
import org.apache.hc.core5.http.ParseException;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.util.TimeValue;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Component
public class HttpClient implements AutoCloseable {
    private final CloseableHttpClient client;

    public HttpClient() {
        var retryStrategy = new DefaultHttpRequestRetryStrategy(3, TimeValue.ofSeconds(2));
        this.client = HttpClients.custom()
                .setRetryStrategy(retryStrategy)
                .build();
    }

    public String fetchContent(String url) throws IOException {
        HttpGet request = createHttpGet(url);

        try (CloseableHttpResponse response = client.execute(request)) {
            validateResponse(response);
            return extractContent(response);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    public String fetchContentJJI(String url) throws IOException, ParseException {
        HttpGet request = createHttpGetJJI(url);

        try (CloseableHttpResponse response = client.execute(request)) {
            validateResponse(response);
            return extractContent(response);
        }
    }

    public String fetchContentSolidJobs(String url) throws IOException, ParseException {
        HttpGet request = createHttpGetSolidJobs(url);

        try (CloseableHttpResponse response = client.execute(request)) {
            validateResponse(response);
            return extractContent(response);
        }
    }

    public String fetchJobOfferFromSolidJobs(String url) throws IOException, ParseException {
        HttpGet request = createHttpGetSolidJobsOffer(url);

        try (CloseableHttpResponse response = client.execute(request)) {
            validateResponse(response);
            return extractContent(response);
        }
    }

    private HttpGet createHttpGet(String url) {
        HttpGet get = new HttpGet(url);
        get.setHeader(HttpHeaders.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " + "(KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36");
        get.setHeader("Accept-Charset", "UTF-8");
        get.setHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
        return get;
    }

    private HttpGet createHttpGetJJI(String url) {
        HttpGet get = new HttpGet(url);
        get.setHeader(HttpHeaders.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0");
        get.setHeader("Accept", "application/json, text/plain, */*");
        get.setHeader("Accept-Encoding", "gzip, deflate, br, zstd");
        get.setHeader("Accept-Language", "pl,en-US;q=0.7,en;q=0.3");
        get.setHeader("DNT", "1");
        get.setHeader("Origin", "https://justjoin.it");
        get.setHeader("Referer", "https://justjoin.it/");
        get.setHeader("Sec-GPC", "1");
        get.setHeader("Version", "2");
        get.setHeader("x-ga", "GA1.1.1025044341.1740338523");
        get.setHeader("x-snowplow", "eyJ1c2VySWQiOiJiOTE3MGVkZS03MDliLTQ3MDgtYTdiZS00ZmQ2YzQ5ZWFkM2EiLCJzZXNzaW9uSWQiOiJiM2FiMmY4Ni1hZDgyLTQ2OGYtOTA4Yi03NzNlMDNhYTc3NDMifQ==");
        return get;
    }

    public HttpResponse<String> createHttpGetLinkedIn(String url) throws IOException, InterruptedException {
        String li_at = "";
        String li_rm = "";
        String cookieHeader = String.format("li_at=%s; li_rm=%s", li_at, li_rm);

        java.net.http.HttpClient client = java.net.http.HttpClient.newBuilder()
                .followRedirects(java.net.http.HttpClient.Redirect.NORMAL)
                .build();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Cookie", cookieHeader)
                .GET()
                .build();

        return client.send(request, HttpResponse.BodyHandlers.ofString());

    }

    private HttpGet createHttpGetSolidJobs(String url) {
        HttpGet get = new HttpGet(url);
        get.setHeader(HttpHeaders.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0");
        get.setHeader("Accept", "application/vnd.solidjobs.jobofferlist+json, application/json");
        get.setHeader("Accept-Encoding", "gzip, deflate, br, zstd");
        get.setHeader("Accept-Language", "pl,en-US;q=0.7,en;q=0.3");
        get.setHeader("App-Version", "1.1.0");
        get.setHeader("Referer", "https://solid.jobs/offers/it");
        get.setHeader("Connection", "keep-alive");
        return get;
    }

    private HttpGet createHttpGetSolidJobsOffer(String url) {
        HttpGet get = new HttpGet(url);
        get.setHeader(HttpHeaders.ACCEPT, "application/vnd.solidjobs.jobofferdetails+json, application/json, text/plain, */*");
        get.setHeader(HttpHeaders.ACCEPT_ENCODING, "gzip, deflate, br, zstd");
        get.setHeader(HttpHeaders.ACCEPT_LANGUAGE, "pl,en-US;q=0.7,en;q=0.3");
        get.setHeader("App-Version", "1.1.0");
        get.setHeader(HttpHeaders.CONNECTION, "keep-alive");
        get.setHeader(HttpHeaders.CONTENT_TYPE, "application/vnd.solidjobs.jobofferdetails+json; charset=UTF-8");
        get.setHeader(HttpHeaders.COOKIE,
                "_gcl_au=1.1.538606253.1747409690; _ga_459JVC9L8F=GS2.1.s1751118480$o6$g1$t1751118774$j55$l0$h0; " +
                        "_ga=GA1.1.145704175.1747409690; ai_user=WHeOd|2025-05-16T15:34:50.081Z; cookieconsent_status=dismiss; " +
                        ".AspNetCore.Antiforgery.cdV5uW_Ejgc=CfDJ8PDYqCu2ZNpJqp1kr4HNTUMA5dlGqgq8_kNsYD9wDNAlnVi9V2EoxepxJPpntnPK2dBAhK9e_q2zl19i8xkT4AemYCAcOH9YkWluDS3ajnEUzIdjcpJGfeZLVhnHiqJm40C6bZyOTVMqT-ZngqtN51k; " +
                        "XSRF-TOKEN=CfDJ8PDYqCu2ZNpJqp1kr4HNTUPrrq3o2A5XKy7UghmKSAaZx89CjjihUyzbc6Ry4EwOsGDaIjnELWUZwEsg457INvR-S2j2gspXEnvfBW_mhoCT56DhZOwTKINlT8d7tz5D3hqNTM19_FGN9zan6QD1Jug; " +
                        "ai_session=uBdao|1751118492588|1751118770175; .AspNetCore.Session=CfDJ8PDYqCu2ZNpJqp1kr4HNTUOrjNEvvCg7bY%2FwLT3hNfS%2FVAmzQH0Kyko4L5Zq6Nn0gPoNRJwQOcfSpJfRazW195Yjp988Dhcs6GWZv%2F%2BVzFNb5uO5%2BRweqDz39wct8lKYb0TuapHK%2FAxTno0221A%2BgiaAjZMnQ7%2F0CzaJ9rhxNhq9"
        );
        get.setHeader(HttpHeaders.HOST, "solid.jobs");
        get.setHeader("Request-Id", "|b131e65756224ec0ade68a092d017efa.6f045187f96b4640");
        get.setHeader("Sec-Fetch-Dest", "empty");
        get.setHeader("Sec-Fetch-Mode", "cors");
        get.setHeader("Sec-Fetch-Site", "same-origin");
        get.setHeader(HttpHeaders.USER_AGENT,
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0"
        );

        return get;
    }

    private void validateResponse(CloseableHttpResponse response) throws IOException {
        int statusCode = response.getCode();
        if (statusCode < 200 || statusCode >= 300) {
            throw new IOException("HTTP request failed with status: " + statusCode);
        }
    }

    private String extractContent(CloseableHttpResponse response) throws IOException, ParseException {
        return EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
    }


    @Override
    public void close() throws Exception {
        if (client != null) {
            client.close();
        }
    }
}
