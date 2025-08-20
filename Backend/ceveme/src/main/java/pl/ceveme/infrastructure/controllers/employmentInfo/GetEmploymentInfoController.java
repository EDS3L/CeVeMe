package pl.ceveme.infrastructure.controllers.employmentInfo;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.ceveme.application.dto.employmentInfo.EmploymentInfoResponse;
import pl.ceveme.application.usecase.employmentInfo.GetEmploymentInfoUseCase;

@RestController
@RequestMapping("/api/employmentInfo/get")
public class GetEmploymentInfoController {

    private final GetEmploymentInfoUseCase getEmploymentInfoUseCase;

    public GetEmploymentInfoController(GetEmploymentInfoUseCase getEmploymentInfoUseCase) {
        this.getEmploymentInfoUseCase = getEmploymentInfoUseCase;
    }

    @GetMapping("/{email}")
    public ResponseEntity<EmploymentInfoResponse> geEmploymentInfo(@PathVariable String email) {
        EmploymentInfoResponse response = getEmploymentInfoUseCase.execute(email);
        return ResponseEntity.ok(response);
    }
}
