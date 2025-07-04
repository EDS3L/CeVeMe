package pl.ceveme.infrastructure.controllers.employmentInfo;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.ceveme.application.dto.employmentInfo.EmploymentInfoRequest;
import pl.ceveme.application.dto.employmentInfo.EmploymentInfoResponse;
import pl.ceveme.application.usecase.employmentInfo.CreateEmploymentInfoUseCase;

@RestController
@RequestMapping("/api/employmentInfo")
public class EmploymentInfoController {

    private final CreateEmploymentInfoUseCase employmentInfoUseCase;

    public EmploymentInfoController(CreateEmploymentInfoUseCase employmentInfoUseCase) {
        this.employmentInfoUseCase = employmentInfoUseCase;
    }

    @PostMapping("/create")
    public ResponseEntity<EmploymentInfoResponse> createEmploymentInfo(@Valid @RequestBody EmploymentInfoRequest request) {
        EmploymentInfoResponse response = employmentInfoUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
