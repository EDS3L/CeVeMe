package pl.ceveme.infrastructure.config.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import pl.ceveme.domain.model.vo.Email;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {

    private static final long DAY_MS = 86_400_000L;
    @Value("${token.secretKey}")
    private String SECRET_KEY;
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

    public String generate(Email subject, Long id) {
        Instant now = Instant.now();
        return Jwts.builder().subject(subject.email()).id(id.toString()).issuedAt(Date.from(now)).expiration(new Date(System.currentTimeMillis() + DAY_MS)).signWith(key, Jwts.SIG.HS256).compact();
    }

    /** Walidacja + Claims */
    public Claims parse(String jwt) throws JwtException {
        return parser.parseSignedClaims(jwt).getPayload();
    }


}
