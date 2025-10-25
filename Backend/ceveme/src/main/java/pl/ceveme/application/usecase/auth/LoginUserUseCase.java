package pl.ceveme.application.usecase.auth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.auth.LoginUserRequest;
import pl.ceveme.application.dto.auth.LoginUserResponse;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.UserRepository;
import pl.ceveme.domain.services.jwt.RefreshTokenService;
import pl.ceveme.infrastructure.adapter.security.BCryptPasswordEncoderAdapter;
import pl.ceveme.infrastructure.config.jwt.JwtService;


@Service
public class LoginUserUseCase {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoderAdapter bCryptPasswordEncoderAdapter;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public LoginUserUseCase(UserRepository userRepository, BCryptPasswordEncoderAdapter bCryptPasswordEncoderAdapter, JwtService jwtService, RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoderAdapter = bCryptPasswordEncoderAdapter;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    @Transactional
    public LoginUserResponse login(LoginUserRequest request, HttpServletResponse servletResponse, HttpServletRequest servletRequest) {
        Email email = new Email(request.email());

        if (!userRepository.existsByEmail(email)) throw new IllegalArgumentException("Email not found");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if(!user.isActive()) {
            throw new IllegalArgumentException("Your account is not activated");
        }

        if (!bCryptPasswordEncoderAdapter.matches(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String userId = String.valueOf(user.getId());

        createRefreshCookie(user,servletRequest,servletResponse);
        generateAccessCookie(email,userId,user,servletResponse);

        return new LoginUserResponse(user.getId(), "Login successful!");

    }

    private void createRefreshCookie(User user, HttpServletRequest servletRequest, HttpServletResponse servletResponse) {
        String refreshToken = refreshTokenService.createRefreshToken(user,servletRequest);
        System.out.println("REFRESH TOKEN: "+refreshToken);
        Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(false);
        refreshCookie.setPath("/");

        servletResponse.addCookie(refreshCookie);

    }

    private void generateAccessCookie(Email email, String userId, User user, HttpServletResponse servletResponse) {
        String accessToken = jwtService.generateAccessToken(email,userId, user.getUserRole());
        Cookie accessCookie = new Cookie("accessToken", accessToken);
        accessCookie.setHttpOnly(false);
        accessCookie.setSecure(false);
        accessCookie.setPath("/");

        servletResponse.addCookie(accessCookie);
    }

}
