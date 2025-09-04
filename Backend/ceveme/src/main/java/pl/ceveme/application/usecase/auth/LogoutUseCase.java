package pl.ceveme.application.usecase.auth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.auth.RefreshResponse;
import pl.ceveme.domain.services.jwt.RefreshTokenService;
import pl.ceveme.infrastructure.config.jwt.JwtService;

@Service
public class LogoutUseCase {

    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public LogoutUseCase(JwtService jwtService, RefreshTokenService refreshTokenService) {
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    @Transactional
    public RefreshResponse execute(String refreshToken, HttpServletResponse servletResponse) {

        if(refreshToken != null) {
            try {
                String jti = jwtService.extractJtiFromRefreshToken(refreshToken);
                refreshTokenService.revokeRefreshToken(jti);
            } catch (Exception e) {

            }
        }


        Cookie refreshCookie = new Cookie("refreshToken", "");
        refreshCookie.setMaxAge(0);
        refreshCookie.setPath("/");
        refreshCookie.setHttpOnly(true);


        Cookie accessToken = new Cookie("accessToken", "");
        accessToken.setMaxAge(0);
        accessToken.setPath("/");
        accessToken.setHttpOnly(true);



        servletResponse.addCookie(refreshCookie);
        servletResponse.addCookie(accessToken);

        return new RefreshResponse("Logged out successfully!");
    }
}
