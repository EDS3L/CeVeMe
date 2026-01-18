package pl.ceveme.application.usecase.location;

import org.springframework.stereotype.Component;
import pl.ceveme.application.dto.location.BoundingBox;

@Component
public class GeoUtils {
    private static final double KM_PER_DEGREE_LAT = 111.1;


    public static BoundingBox calculateBoundingBox(double lat, double lon, double radiusKm) {
        double latDelta = radiusKm / KM_PER_DEGREE_LAT;

        double lonDelta = radiusKm / (KM_PER_DEGREE_LAT * Math.cos(Math.toRadians(lat)));

        return new BoundingBox(
                lat - latDelta,
                lat + latDelta,
                lon - lonDelta,
                lon + lonDelta
        );
    }
}