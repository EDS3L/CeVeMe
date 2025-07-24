package pl.ceveme.application.usecase.auth;

import jakarta.transaction.Transactional;
import org.checkerframework.checker.units.qual.A;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.auth.RegisterUserRequest;
import pl.ceveme.application.dto.auth.RegisterUserResponse;
import pl.ceveme.domain.model.entities.ActivationToken;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.*;
import pl.ceveme.domain.repositories.ActivationTokenRepository;
import pl.ceveme.domain.repositories.UserRepository;
import pl.ceveme.infrastructure.adapter.security.BCryptPasswordEncoderAdapter;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class RegisterUserUseCase {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoderAdapter bCryptPasswordEncoderAdapter;

    public RegisterUserUseCase(UserRepository userRepository, BCryptPasswordEncoderAdapter bCryptPasswordEncoderAdapter) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoderAdapter = bCryptPasswordEncoderAdapter;
    }

    @Transactional
    public RegisterUserResponse register(RegisterUserRequest request) {
        Name name = new Name(request.name());
        Surname surname = new Surname(request.surname());
        Email email = new Email(request.email());
        PhoneNumber phoneNumber = new PhoneNumber(request.phoneNumber());
        Password password = new Password(request.password());
        ActivationToken activationToken = new ActivationToken(LocalDate.now().plusWeeks(2));


        if(userRepository.existsByEmail(email)) throw new IllegalArgumentException("Email already exists!");


        User user = User.createNewUser(name,surname,phoneNumber,bCryptPasswordEncoderAdapter.encode(password),email,null,null,null,null,activationToken);
        activationToken.setUser(user);
        userRepository.save(user);

        return new RegisterUserResponse(name.name(),surname.surname(),email.email(),"Register successful!");
    }
}
