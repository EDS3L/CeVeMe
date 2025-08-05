package pl.ceveme.infrastructure.controllers.auth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.ceveme.application.dto.auth.*;
import pl.ceveme.application.usecase.auth.ActiveUserUseCase;
import pl.ceveme.application.usecase.auth.LoginUserUseCase;
import pl.ceveme.application.usecase.auth.RegisterUserUseCase;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {


    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final LoginUserUseCase loginUserUseCase;
    private final RegisterUserUseCase registerUserUseCase;
    private final ActiveUserUseCase activeUserUseCase;

    public AuthController(LoginUserUseCase loginUserUseCase, RegisterUserUseCase registerUserUseCase, ActiveUserUseCase activeUserUseCase) {
        this.loginUserUseCase = loginUserUseCase;
        this.registerUserUseCase = registerUserUseCase;
        this.activeUserUseCase = activeUserUseCase;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginUserResponse> login(@RequestBody LoginUserRequest loginUserRequest, HttpServletResponse servletResponse) {

            LoginUserResponse response = loginUserUseCase.login(loginUserRequest);
            Cookie cookie = new Cookie("jwt", response.token());
            cookie.setHttpOnly(false);
            cookie.setSecure(false);
            cookie.setPath("/");


            servletResponse.addCookie(cookie);

            return ResponseEntity.ok(new LoginUserResponse(response.userId(),null, response.message()));

    }

    @PostMapping("/register")
    public ResponseEntity<RegisterUserResponse> register(@RequestBody RegisterUserRequest request) {

        RegisterUserResponse response = registerUserUseCase.register(request);
        return ResponseEntity.ok(response);

    }

    @PostMapping("/active/user/{uuid}")
    public ResponseEntity<ActiveUserResponse> activateUser(@PathVariable String uuid) {
            ActiveUserRequest request = new ActiveUserRequest(uuid);
            ActiveUserResponse response = activeUserUseCase.execute(request);
            return ResponseEntity.ok(response);
    }
}
