package pl.ceveme.infrastructure.controllers.applicationHistory;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.ceveme.application.dto.applicationHistories.ApplicationHistoriesRequest;
import pl.ceveme.application.dto.applicationHistories.ApplicationHistoriesResponse;
import pl.ceveme.application.dto.entity.applicationHistory.ApplicationHistoryRequest;
import pl.ceveme.application.dto.entity.applicationHistory.ApplicationHistoryResponse;
import pl.ceveme.application.usecase.applicationHistory.ChangeAppliactanionHistoriesStatus;
import pl.ceveme.application.usecase.applicationHistory.GetApplicationHistoriesUseCase;
import pl.ceveme.application.usecase.applicationHistory.SaveApplicationHistoryUseCase;
import pl.ceveme.domain.model.entities.User;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/applicationHistory")
public class ApplicationHistoryController {

    private final SaveApplicationHistoryUseCase saveApplicationHistoryUseCase;
    private final GetApplicationHistoriesUseCase getApplicationHistoriesUseCase;
    private final ChangeAppliactanionHistoriesStatus changeAppliactanionHistoriesStatus;

    public ApplicationHistoryController(SaveApplicationHistoryUseCase saveApplicationHistoryUseCase, GetApplicationHistoriesUseCase getApplicationHistoriesUseCase, ChangeAppliactanionHistoriesStatus changeAppliactanionHistoriesStatus) {
        this.saveApplicationHistoryUseCase = saveApplicationHistoryUseCase;
        this.getApplicationHistoriesUseCase = getApplicationHistoriesUseCase;
        this.changeAppliactanionHistoriesStatus = changeAppliactanionHistoriesStatus;
    }

    @PostMapping("/save")
    public ResponseEntity<ApplicationHistoryResponse> save(@RequestBody ApplicationHistoryRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        return ResponseEntity.ok(saveApplicationHistoryUseCase.execute(request,userId));
    }


    @GetMapping("/")
    public ResponseEntity<List<ApplicationHistoriesResponse>> histories(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        return ResponseEntity.ok(getApplicationHistoriesUseCase.execute(userId));
    }

    @PatchMapping("/edit")
    public ResponseEntity<ApplicationHistoriesResponse> edit(@RequestBody ApplicationHistoriesRequest request, Authentication authentication) throws AccessDeniedException {
        User user= (User) authentication.getPrincipal();
        Long userId = user.getId();

        ApplicationHistoriesResponse response = changeAppliactanionHistoriesStatus.changeStatus(request, userId);
        return ResponseEntity.ok(response);

    }
}
