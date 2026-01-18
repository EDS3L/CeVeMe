package pl.ceveme.infrastructure.controllers.location;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.ceveme.application.dto.location.FindJobsInRadiusCommand;
import pl.ceveme.application.usecase.location.FindJobsInRadiusUseCase;
import pl.ceveme.domain.model.entities.JobOffer;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/location")
public class LocationController {

    private final FindJobsInRadiusUseCase findJobsInRadiusUseCase;

    public LocationController(FindJobsInRadiusUseCase findJobsInRadiusUseCase) {
        this.findJobsInRadiusUseCase = findJobsInRadiusUseCase;
    }

    @GetMapping("/getInRadius")
    public ResponseEntity<List<JobOffer>> getInRadius(@RequestParam String city, @RequestParam double kmRadius) throws IOException, InterruptedException {
        List<JobOffer> jobOffers = findJobsInRadiusUseCase.execute(new FindJobsInRadiusCommand(city,kmRadius));
        return ResponseEntity.ok().body(jobOffers);
    }


}
