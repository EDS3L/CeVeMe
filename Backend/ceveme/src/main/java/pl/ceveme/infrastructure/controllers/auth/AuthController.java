package pl.ceveme.infrastructure.controllers.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.ceveme.application.dto.auth.*;
import pl.ceveme.application.dto.email.EmailResponse;
import pl.ceveme.application.usecase.auth.*;
import pl.ceveme.application.usecase.email.SendConfirmationCodeAgainUseCase;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.infrastructure.config.jwt.JwtService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {


    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final LoginUserUseCase loginUserUseCase;
    private final RegisterUserUseCase registerUserUseCase;
    private final ActiveUserUseCase activeUserUseCase;
    private final RefreshUseCase refreshUseCase;
    private final JwtService jwtService;
    private final LogoutUseCase logoutUseCase;
    private final SendConfirmationCodeAgainUseCase sendConfirmationCodeAgainUseCase;


    public AuthController(LoginUserUseCase loginUserUseCase, RegisterUserUseCase registerUserUseCase, ActiveUserUseCase activeUserUseCase, RefreshUseCase refreshUseCase, JwtService jwtService, LogoutUseCase logoutUseCase, SendConfirmationCodeAgainUseCase sendConfirmationCodeAgainUseCase) {
        this.loginUserUseCase = loginUserUseCase;
        this.registerUserUseCase = registerUserUseCase;
        this.activeUserUseCase = activeUserUseCase;
        this.refreshUseCase = refreshUseCase;
        this.jwtService = jwtService;
        this.logoutUseCase = logoutUseCase;
        this.sendConfirmationCodeAgainUseCase = sendConfirmationCodeAgainUseCase;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginUserResponse> login(@RequestBody LoginUserRequest loginUserRequest, HttpServletResponse servletResponse, HttpServletRequest request) {

        LoginUserResponse response = loginUserUseCase.login(loginUserRequest, servletResponse, request);
        return ResponseEntity.ok(response);

    }

    @PostMapping("/register")
    public ResponseEntity<RegisterUserResponse> register(@RequestBody RegisterUserRequest request) {

        RegisterUserResponse response = registerUserUseCase.register(request);
        return ResponseEntity.ok(response);

    }

    @PostMapping("/refresh")
    public ResponseEntity<RefreshResponse> refreshToken(HttpServletRequest servletRequest, HttpServletResponse servletResponse) {
        String refreshToken = jwtService.extractTokenFromCookie(servletRequest, "refreshToken");
        if (refreshToken == null) {
            return ResponseEntity.status(401)
                    .body(new RefreshResponse("Refresh token not found"));
        }
        RefreshResponse response = refreshUseCase.execute(refreshToken, servletResponse);


        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<RefreshResponse> logout(HttpServletRequest request,HttpServletResponse servletResponse) {
        RefreshResponse response = logoutUseCase.execute(request,servletResponse);

        return ResponseEntity.ok(response);
    }


    @PostMapping("/active/user/{uuid}")
    public ResponseEntity<ActiveUserResponse> activateUser(@PathVariable String uuid) {
        ActiveUserRequest request = new ActiveUserRequest(uuid);
        ActiveUserResponse response = activeUserUseCase.execute(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/active/sendConfirmationCode")
    public ResponseEntity<EmailResponse> sendActiveCode(@RequestBody Email email) {
        EmailResponse emailResponse = sendConfirmationCodeAgainUseCase.send(email);
        return ResponseEntity.ok(emailResponse);
    }


}
