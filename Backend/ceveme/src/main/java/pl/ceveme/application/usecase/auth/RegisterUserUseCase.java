package pl.ceveme.application.usecase.auth;

import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.auth.RegisterUserRequest;
import pl.ceveme.application.dto.auth.RegisterUserResponse;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.*;
import pl.ceveme.domain.repositories.UserRepository;
import pl.ceveme.infrastructure.adapter.security.BCryptPasswordEncoderAdapter;

@Service
public class RegisterUserUseCase {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoderAdapter bCryptPasswordEncoderAdapter;

    public RegisterUserUseCase(UserRepository userRepository, BCryptPasswordEncoderAdapter bCryptPasswordEncoderAdapter) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoderAdapter = bCryptPasswordEncoderAdapter;
    }


    public RegisterUserResponse register(RegisterUserRequest request) {
        Name name = new Name(request.name());
        Surname surname = new Surname(request.surname());
        Email email = new Email(request.email());
        PhoneNumber phoneNumber = new PhoneNumber(request.phoneNumber());
        Password password = new Password(request.password());

        if(userRepository.existsByEmail(email)) throw new IllegalArgumentException("Email already exists!");


        User user = User.createNewUser(name,surname,phoneNumber,bCryptPasswordEncoderAdapter.encode(password),email,null,null,null,null);

        userRepository.save(user);

        return new RegisterUserResponse(name.name(),surname.surname(),email.email(),"Register successful!");
    }
}
