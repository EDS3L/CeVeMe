package pl.ceveme.infrastructure.controllers.auth;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.ceveme.application.dto.auth.RegisterUserRequest;
import pl.ceveme.application.dto.auth.RegisterUserResponse;
import pl.ceveme.application.usecase.auth.RegisterUserUseCase;

@RestController
@RequestMapping("/api/auth")
public class RegisterController {

    private final RegisterUserUseCase registerUserUseCase;


    public RegisterController(RegisterUserUseCase registerUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterUserResponse> login(@RequestBody RegisterUserRequest request) {
        try {
            RegisterUserResponse response = registerUserUseCase.register(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new RegisterUserResponse(null, null, null, "Invalid credentials"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new RegisterUserResponse(null, null,null, "An error occurred"));
        }
    }
}

