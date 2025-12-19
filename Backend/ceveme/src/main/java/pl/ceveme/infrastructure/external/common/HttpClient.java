package pl.ceveme.infrastructure.external.common;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.WaitUntilState;
import jakarta.annotation.PreDestroy;
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.cookie.BasicCookieStore;
import org.apache.hc.client5.http.impl.DefaultHttpRequestRetryStrategy;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ClassicHttpResponse;
import org.apache.hc.core5.http.HttpHeaders;
import org.apache.hc.core5.http.ParseException;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.util.TimeValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
public class HttpClient implements AutoCloseable {
    private static final Logger log = LoggerFactory.getLogger(HttpClient.class);
    private final CloseableHttpClient client;
    private final BasicCookieStore cookieStore;

    private Playwright playwright;
    private Browser browser;

    @Value("${linkedIn.li-at}")
    private String li_at;
    @Value("${linkedIn.li-rm}")
    private String li_rm;

    public HttpClient() {
        var retryStrategy = new DefaultHttpRequestRetryStrategy(3, TimeValue.ofSeconds(2));
        this.cookieStore = new BasicCookieStore();

        this.client = HttpClients.custom()
                .setRetryStrategy(retryStrategy)
                .setDefaultCookieStore(cookieStore)
                .setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
                .build();
    }


    public String fetchContentWithBrowser(String url) {
        log.info("Executing browser request for Cloudflare-protected site: {}", url);
        ensureBrowserInitialized();

        try (BrowserContext context = browser.newContext(new Browser.NewContextOptions()
                .setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"))) {

            Page page = context.newPage();
            page.setExtraHTTPHeaders(Map.of(
                    "Accept-Language", "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
                    "Cache-Control", "no-cache"
            ));

            page.navigate(url, new Page.NavigateOptions().setWaitUntil(WaitUntilState.NETWORKIDLE));

            page.waitForTimeout(2000);

            return page.content();
        } catch (Exception e) {
            log.error("Failed to fetch content with Playwright from: {}", url, e);
            throw new RuntimeException("Browser-based fetch failed", e);
        }
    }

    private synchronized void ensureBrowserInitialized() {
        if (playwright == null) {
            log.info("Starting Playwright engine...");
            playwright = Playwright.create();
            browser = playwright.chromium().launch(new BrowserType.LaunchOptions()
                    .setHeadless(true));
        }
    }


    public String fetchContent(String url) throws IOException {
        HttpGet request = createHttpGet(url);
        log.info("Executing request {}", request.getRequestUri());
        return client.execute(request, response -> {
            validateResponse(response);
            return extractContent(response);
        });
    }

    public String fetchContentJJI(String url) throws IOException {
        HttpGet request = createHttpGetJJI(url);
        return client.execute(request, response -> {
            validateResponse(response);
            return extractContent(response);
        });
    }

    public String fetchContentSolidJobs(String url) throws IOException {
        HttpGet request = createHttpGetSolidJobs(url);
        return client.execute(request, response -> {
            validateResponse(response);
            return extractContent(response);
        });
    }

    public String fetchJobOfferFromSolidJobs(String url) throws IOException {
        HttpGet request = createHttpGetSolidJobsOffer(url);
        return client.execute(request, response -> {
            validateResponse(response);
            return extractContent(response);
        });
    }

    private HttpGet createHttpGet(String url) {
        HttpGet get = new HttpGet(url);
        get.setHeader(HttpHeaders.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0");
        get.setHeader(HttpHeaders.ACCEPT, "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8");
        get.setHeader(HttpHeaders.ACCEPT_LANGUAGE, "pl,en-US;q=0.7,en;q=0.3");
        get.setHeader(HttpHeaders.ACCEPT_ENCODING, "gzip, deflate");
        get.setHeader("Upgrade-Insecure-Requests", "1");
        return get;
    }

    private HttpGet createHttpGetJJI(String url) {
        HttpGet get = new HttpGet(url);
        get.setHeader(HttpHeaders.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0");
        get.setHeader(HttpHeaders.ACCEPT, "application/json, text/plain, */*");
        get.setHeader(HttpHeaders.ACCEPT_ENCODING, "gzip, deflate, br, zstd");
        get.setHeader(HttpHeaders.ACCEPT_LANGUAGE, "pl,en-US;q=0.7,en;q=0.3");
        get.setHeader("Origin", "https://justjoin.it");
        get.setHeader("Referer", "https://justjoin.it/");
        return get;
    }

    public HttpResponse<String> createHttpGetLinkedIn(String url) throws IOException, InterruptedException {
        String cookieHeader = String.format("li_at=%s; li_rm=%s", li_at, li_rm);
        java.net.http.HttpClient clientNet = java.net.http.HttpClient.newBuilder().followRedirects(java.net.http.HttpClient.Redirect.NORMAL).build();
        HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).header("Cookie", cookieHeader).header(HttpHeaders.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36").GET().build();
        return clientNet.send(request, HttpResponse.BodyHandlers.ofString());
    }

    private HttpGet createHttpGetSolidJobs(String url) {
        HttpGet get = new HttpGet(url);
        get.setHeader(HttpHeaders.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0");
        get.setHeader(HttpHeaders.ACCEPT, "application/vnd.solidjobs.jobofferlist+json, application/json");
        return get;
    }

    private HttpGet createHttpGetSolidJobsOffer(String url) {
        HttpGet get = new HttpGet(url);
        get.setHeader(HttpHeaders.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0");
        get.setHeader(HttpHeaders.ACCEPT, "application/vnd.solidjobs.jobofferdetails+json, application/json, text/plain, */*");
        return get;
    }

    private void validateResponse(ClassicHttpResponse response) throws IOException {
        int statusCode = response.getCode();
        if (statusCode < 200 || statusCode >= 300) {
            throw new IOException("HTTP request failed with status: " + statusCode);
        }
    }

    private String extractContent(ClassicHttpResponse response) throws IOException, ParseException {
        return EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
    }

    @Override
    @PreDestroy
    public void close() throws Exception {
        if (client != null) client.close();
        if (browser != null) browser.close();
        if (playwright != null) playwright.close();
        log.info("HttpClient and Browser resources closed.");
    }
}