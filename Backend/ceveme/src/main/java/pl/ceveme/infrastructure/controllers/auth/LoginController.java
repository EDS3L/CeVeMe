package pl.ceveme.infrastructure.controllers.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.ceveme.application.dto.auth.LoginUserRequest;
import pl.ceveme.application.dto.auth.LoginUserResponse;
import pl.ceveme.application.usecase.auth.LoginUserUseCase;

@RestController
@RequestMapping("/api/auth")
public class LoginController {


    private final LoginUserUseCase loginUserUseCase;

    public LoginController(LoginUserUseCase loginUserUseCase) {
        this.loginUserUseCase = loginUserUseCase;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginUserResponse> login(@RequestBody LoginUserRequest loginUserRequest) {

            LoginUserResponse response = loginUserUseCase.login(loginUserRequest);
            return ResponseEntity.ok(response);

    }
}
