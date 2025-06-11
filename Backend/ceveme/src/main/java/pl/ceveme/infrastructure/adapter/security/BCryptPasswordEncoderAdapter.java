package pl.ceveme.infrastructure.adapter.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import pl.ceveme.domain.model.vo.Password;

@Component
public class BCryptPasswordEncoderAdapter {

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public BCryptPasswordEncoderAdapter(BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }


    public String encode(Password rawPassword) {
        return bCryptPasswordEncoder.encode(rawPassword.password());
    }

    public boolean matches(String rawPassword, String encodedPassword) {
        return bCryptPasswordEncoder.matches(rawPassword,encodedPassword);
    }

}
