package pl.ceveme.infrastructure.controllers.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.ceveme.application.dto.auth.LoginUserRequest;
import pl.ceveme.application.dto.auth.LoginUserResponse;
import pl.ceveme.application.dto.auth.RegisterUserRequest;
import pl.ceveme.application.dto.auth.RegisterUserResponse;
import pl.ceveme.application.usecase.auth.LoginUserUseCase;
import pl.ceveme.application.usecase.auth.RegisterUserUseCase;

@RestController
@RequestMapping("/api/auth")
public class AuthController {


    private final LoginUserUseCase loginUserUseCase;
    private final RegisterUserUseCase registerUserUseCase;


    public AuthController(LoginUserUseCase loginUserUseCase, RegisterUserUseCase registerUserUseCase) {
        this.loginUserUseCase = loginUserUseCase;
        this.registerUserUseCase = registerUserUseCase;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginUserResponse> login(@RequestBody LoginUserRequest loginUserRequest) {

            LoginUserResponse response = loginUserUseCase.login(loginUserRequest);
            return ResponseEntity.ok(response);

    }

    @PostMapping("/register")
    public ResponseEntity<RegisterUserResponse> register(@RequestBody RegisterUserRequest request) {

        RegisterUserResponse response = registerUserUseCase.register(request);
        return ResponseEntity.ok(response);

    }
}
