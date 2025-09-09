package pl.ceveme.infrastructure.config.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.enums.UserRole;
import pl.ceveme.domain.model.vo.Email;

import javax.crypto.SecretKey;
import javax.security.sasl.AuthenticationException;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.Date;

@Service
public class JwtService {

    private static final long DAY_MS = 86_400_000L;
    @Value("${token.secretKey}")
    private String SECRET_KEY;

    @Value("${jwt.access-expiration}")
    private long accessTokenExpiration; // 15 min

    @Value("${jwt.refresh-expiration}")
    private long refreshTokenExpiration; // 30 days

    private SecretKey key;
    private JwtParser parser;

    public JwtService() {
    }

    @PostConstruct
    private void init() {
        byte[] decoded = Decoders.BASE64.decode(SECRET_KEY);
        key = Keys.hmacShaKeyFor(decoded);

        parser = Jwts.parser().verifyWith(key).build();
    }

    public String generateAccessToken(Email email, String id, UserRole userRole) {
        Instant now = Instant.now();
        Date nowDate = Date.from(now);
        return Jwts.builder()
                .subject(email.email())
                .id(id)
                .issuedAt(nowDate)
                .expiration(Date.from(now.plusMillis(accessTokenExpiration)))
                .claim("type", "access")
                .claim("role", userRole)
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    public String generateRefreshToken(Email email, String id) {
        Date now = Date.from(java.time.ZonedDateTime.now().toInstant());

        return Jwts.builder()
                .subject(email.email())
                .id(id)
                .issuedAt(now)
                .expiration(Date.from(now.toInstant().plusMillis(refreshTokenExpiration)))
                .claim("type", "refresh")
                .signWith(key,Jwts.SIG.HS256)
                .compact();
    }

    public boolean isAccessTokenValid(String token, User userDetails) {
        try {
            Claims claims = parse(token);
            String tokenType = (String) claims.get("type");

            return "access".equals(tokenType)
                    && claims.getSubject().equals(userDetails.getEmail().email())
                    && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    public String extractJtiFromRefreshToken(String token)  {
        try {
            Claims claims = parse(token);
            String tokenType = (String) claims.get("type");

            if(!"refresh".equals(tokenType)) {
                throw new IllegalArgumentException("Not a refresh token");
            }

            return claims.getId();
        }catch (Exception e) {
            throw new IllegalArgumentException("Invalid refresh token");
        }
    }

    private boolean isTokenExpired(String token){
        return parse(token).getExpiration().before(new Date());
    }




//    public String generate(Email subject, Long id) {
//        Instant now = Instant.now();
//        return Jwts.builder()
//                .subject(subject.email())
//                .id(id.toString())
//                .issuedAt(Date.from(now))
//                .expiration(new Date(System.currentTimeMillis() + DAY_MS))
//                .signWith(key, Jwts.SIG.HS256)
//                .compact();
//    }

    public Claims parse(String jwt){
        return parser.parseSignedClaims(jwt).getPayload();
    }

    @Transactional
    public String extractTokenFromCookie(HttpServletRequest request, String cookieName) {
        if (request.getCookies() != null) {
            return Arrays.stream(request.getCookies())
                    .filter(cookie -> cookieName.equals(cookie.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
        }
        return null;
    }


}
