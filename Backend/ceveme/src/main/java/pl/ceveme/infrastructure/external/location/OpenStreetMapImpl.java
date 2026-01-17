package pl.ceveme.infrastructure.external.location;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import pl.ceveme.application.dto.location.LocationResponse;
import pl.ceveme.application.port.out.LocationFinder;
import pl.ceveme.infrastructure.external.common.HttpClient;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OpenStreetMapImpl implements LocationFinder {

    private static final Logger log = LoggerFactory.getLogger(OpenStreetMapImpl.class);
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public OpenStreetMapImpl(HttpClient httpClient, ObjectMapper objectMapper) {
        this.httpClient = httpClient;
        this.objectMapper = objectMapper;
    }

    @Override
    public LocationResponse findByCityName(String cityName) throws IOException, InterruptedException {
        Thread.sleep(1000);

        String encodedAddress = URLEncoder.encode(cityName, StandardCharsets.UTF_8);
        String url = "https://nominatim.openstreetmap.org/search?q=" + encodedAddress + "&format=json&limit=1";

        String response = httpClient.fetchContent(url);


        JsonNode root = objectMapper.readTree(response);
        if (root.isEmpty()) return null;
        JsonNode firstResult = root.get(0);

        String lat = firstResult.get("lat").asText();
        String lon = firstResult.get("lon").asText();

        double longitude = Double.parseDouble(lon);
        double latitude = Double.parseDouble(lat);
        log.info("Lat: {}, Lon: {}", longitude, latitude);


        return new LocationResponse(latitude, longitude);

    }

}
