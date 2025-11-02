package pl.ceveme.application.usecase.auth;

import jakarta.transaction.Transactional;
import org.checkerframework.checker.units.qual.A;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.auth.RegisterUserRequest;
import pl.ceveme.application.dto.auth.RegisterUserResponse;
import pl.ceveme.domain.model.entities.ActivationToken;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.*;
import pl.ceveme.domain.repositories.ActivationTokenRepository;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;
import pl.ceveme.domain.repositories.UserRepository;
import pl.ceveme.infrastructure.adapter.security.BCryptPasswordEncoderAdapter;
import pl.ceveme.infrastructure.external.email.ConfirmationRegisterEmail;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class RegisterUserUseCase {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoderAdapter bCryptPasswordEncoderAdapter;
    private final EmploymentInfoRepository employmentInfoRepository;
    private final ConfirmationRegisterEmail confirmationRegisterEmail;

    public RegisterUserUseCase(UserRepository userRepository, BCryptPasswordEncoderAdapter bCryptPasswordEncoderAdapter, EmploymentInfoRepository employmentInfoRepository, ConfirmationRegisterEmail confirmationRegisterEmail) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoderAdapter = bCryptPasswordEncoderAdapter;
        this.employmentInfoRepository = employmentInfoRepository;
        this.confirmationRegisterEmail = confirmationRegisterEmail;
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


        User user = User.createNewUser(name,surname,phoneNumber,bCryptPasswordEncoderAdapter.encode(password),email,null,null,null,null,activationToken, request.city());
        EmploymentInfo employmentInfo = new EmploymentInfo();
        user.setEmploymentInfo(employmentInfo);
        employmentInfo.setUser(user);
        activationToken.setUser(user);
        employmentInfoRepository.save(employmentInfo);
        userRepository.save(user);

        confirmationRegisterEmail.send(activationToken.getUuid(), email.email());

        return new RegisterUserResponse(name.name(),surname.surname(),email.email(), request.city(), "Register successful!");
    }
}
