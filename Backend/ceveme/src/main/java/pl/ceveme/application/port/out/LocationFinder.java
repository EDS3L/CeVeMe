package pl.ceveme.application.port.out;

import pl.ceveme.application.dto.location.LocationResponse;

import java.io.IOException;

public interface LocationFinder {

    LocationResponse findByCityName(String cityName) throws IOException, InterruptedException;


}
