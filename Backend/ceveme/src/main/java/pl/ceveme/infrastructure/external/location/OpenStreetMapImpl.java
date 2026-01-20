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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
        return findLocAndLat(cityName);

    }

    @Override
    public LocationResponse findByCityAndStreetName(String cityName, String streetName) throws IOException, InterruptedException {

        String fullAddress = cityName + " ," + streetName;
        return findLocAndLat(fullAddress);

    }

    private LocationResponse findLocAndLat(String location) throws InterruptedException, IOException {
        String response = fetchContent(location);
        JsonNode root = objectMapper.readTree(response);

        Pattern pattern = Pattern.compile("wojew[oó]dztwo\\s+([^,]+)",
                Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);

        if (root.isEmpty()) return null;
        JsonNode firstResult = root.get(0);

        String lat = firstResult.get("lat").asText();
        String lon = firstResult.get("lon").asText();

        double longitude = Double.parseDouble(lon);
        double latitude = Double.parseDouble(lat);



        String displayName = firstResult.get("display_name").asText();
        if (displayName == null) return null;

        Matcher matcher = pattern.matcher(displayName);

        String voivodeship = matcher.find() ? matcher.group(1).trim() : null;

        log.info("Lat: {}, Lon: {}, voivodeship: {}",  longitude, latitude,voivodeship );

        return new LocationResponse(latitude, longitude,voivodeship);
    }


    private String fetchContent(String location) throws IOException, InterruptedException {
        Thread.sleep(1000);

        String encodedAddress = URLEncoder.encode(location, StandardCharsets.UTF_8);
        String url = "https://nominatim.openstreetmap.org/search?q=" +
                encodedAddress +
                "&format=json" +
                 "&limit=1" +
                "&addressdetails=1";

        return httpClient.fetchContent(url);
    }
}
