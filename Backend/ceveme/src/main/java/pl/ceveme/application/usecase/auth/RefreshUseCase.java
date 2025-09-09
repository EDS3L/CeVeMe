package pl.ceveme.application.usecase.auth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.ceveme.application.dto.auth.RefreshResponse;
import pl.ceveme.domain.model.entities.RefreshToken;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.services.jwt.RefreshTokenService;
import pl.ceveme.infrastructure.config.jwt.JwtService;

@Service
public class RefreshUseCase {


    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public RefreshUseCase(JwtService jwtService, RefreshTokenService refreshTokenService) {
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }



    @Transactional
    public RefreshResponse execute(String refreshToken, HttpServletResponse servletResponse) {

        RefreshToken storedToken = refreshTokenService.validRefreshToken(refreshToken);

        User user = storedToken.getUser();
        String userId = String.valueOf(user.getId());

        String newAccessToken = jwtService.generateAccessToken(user.getEmail(), userId, user.getUserRole());


        Cookie accessCookie = new Cookie("accessToken", newAccessToken);
        accessCookie.setHttpOnly(false);
        accessCookie.setSecure(false);
        accessCookie.setPath("/");

        servletResponse.addCookie(accessCookie);

        return new RefreshResponse("Refresh token created!");


    }

}
