//package pl.ceveme.infrastructure.external;
//
//import org.apache.hc.client5.http.classic.methods.HttpGet;
//import org.apache.hc.client5.http.impl.DefaultHttpRequestRetryStrategy;
//import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
//import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
//import org.apache.hc.client5.http.impl.classic.HttpClients;
//import org.apache.hc.core5.http.HttpHeaders;
//import org.apache.hc.core5.http.io.entity.EntityUtils;
//import org.apache.hc.core5.util.TimeValue;
//import org.springframework.stereotype.Component;
//
//import java.io.IOException;
//import java.nio.charset.StandardCharsets;
//
//@Component
//public class HttpClientWrapper implements AutoCloseable {
//    private final CloseableHttpClient client;
//
//    public HttpClientWrapper(CloseableHttpClient client) {
//        var retryStrategy = new DefaultHttpRequestRetryStrategy(3, TimeValue.ofSeconds(2));
//        this.client = HttpClients.custom().setRetryStrategy(retryStrategy).build();
//    }
//
//    public String fetchContent(String url) throws IOException {
//        HttpGet request = createHttpGet(url);
//
//        try (CloseableHttpResponse response = client.execute(request)) {
//            validateResponse(response);
//            return extractContent(response);
//        }
//    }
//
//    private HttpGet createHttpGet(String url) {
//        HttpGet get = new HttpGet(url);
//        get.setHeader(HttpHeaders.USER_AGENT,
//                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
//                        "(KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36");
//        get.setHeader("Accept-Charset", "UTF-8");
//        get.setHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
//        return get;
//    }
//
//    private void validateResponse(CloseableHttpResponse response) throws IOException {
//        int statusCode = response.getCode();
//        if (statusCode < 200 || statusCode >= 300) {
//            throw new IOException("HTTP request failed with status: " + statusCode);
//        }
//    }
//
//    private String extractContent(CloseableHttpResponse response) throws IOException {
//        byte[] responseBytes = EntityUtils.toByteArray(response.getEntity());
//        String content = new String(responseBytes, "Windows-1250");
//        return new String(content.getBytes("windows-1250"), StandardCharsets.UTF_8);
//    }
//
//    @Override
//    public void close() throws Exception {
//        if(client != null) {
//            client.close();
//        }
//    }
//}
