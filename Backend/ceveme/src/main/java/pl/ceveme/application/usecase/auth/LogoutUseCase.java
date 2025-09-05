package pl.ceveme.application.usecase.auth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
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
    public RefreshResponse execute(HttpServletRequest request, HttpServletResponse servletResponse) {
        String refreshToken = jwtService.extractTokenFromCookie(request,"refreshToken");

        if(refreshToken != null) {
            try {
                String jti = jwtService.extractJtiFromRefreshToken(refreshToken);
                refreshTokenService.revokeRefreshToken(jti);
            } catch (Exception e) {

            }
        }
        // clears all cookies from request
        Cookie[] cookies = request.getCookies();
        if (cookies != null)
            for (Cookie cookie : cookies) {
                cookie.setValue("");
                cookie.setPath("/");
                cookie.setMaxAge(0);
                servletResponse.addCookie(cookie);
            }

        return new RefreshResponse("Logged out successfully!");
    }

    }
