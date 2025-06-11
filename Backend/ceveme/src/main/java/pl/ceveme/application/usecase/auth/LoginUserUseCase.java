package pl.ceveme.application.usecase.auth;

import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.auth.LoginUserRequest;
import pl.ceveme.application.dto.auth.LoginUserResponse;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.model.vo.Password;
import pl.ceveme.domain.repositories.UserRepository;
import pl.ceveme.infrastructure.adapter.security.BCryptPasswordEncoderAdapter;
import pl.ceveme.infrastructure.config.jwt.JwtService;


@Service
public class LoginUserUseCase {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoderAdapter bCryptPasswordEncoderAdapter;
    private final JwtService jwtService;

    public LoginUserUseCase(UserRepository userRepository, BCryptPasswordEncoderAdapter bCryptPasswordEncoderAdapter, JwtService jwtService) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoderAdapter = bCryptPasswordEncoderAdapter;
        this.jwtService = jwtService;
    }

    public LoginUserResponse login(LoginUserRequest request) {
        Email email = new Email(request.email());

        if(!userRepository.existsByEmail(email)) throw new IllegalArgumentException("Email not found");

        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));

        if(!bCryptPasswordEncoderAdapter.matches(request.password(),user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }


        String token = jwtService.generate(email);
        return new LoginUserResponse(user.getId(),token, "Login successful!");

    }
}
