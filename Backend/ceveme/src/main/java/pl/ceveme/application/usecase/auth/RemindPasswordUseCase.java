package pl.ceveme.application.usecase.auth;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.auth.RemindPasswordRequest;
import pl.ceveme.application.dto.user.ChangePasswordRequest;
import pl.ceveme.application.dto.user.ChangePasswordResponse;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.UserRepository;
import pl.ceveme.infrastructure.adapter.security.BCryptPasswordEncoderAdapter;

import java.time.LocalDateTime;


@Service
public class RemindPasswordUseCase {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoderAdapter bCryptPasswordEncoderAdapter;

    public RemindPasswordUseCase(UserRepository userRepository, BCryptPasswordEncoderAdapter bCryptPasswordEncoderAdapter) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoderAdapter = bCryptPasswordEncoderAdapter;
    }

    @Transactional
    public ChangePasswordResponse remindPassword(RemindPasswordRequest request, String passwordToken) {
        Email email = new Email(request.email());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));


        if (!user.getPasswordToken().getToken().equals(passwordToken) && user.getPasswordToken().getExpirationDate().isBefore(LocalDateTime.now()))
            throw new IllegalArgumentException("Wrong password token");

        user.remindPassword(
                request.newPassword(),
                request.confirmNewPassword(),
                bCryptPasswordEncoderAdapter
        );

        return new ChangePasswordResponse(user.getId(), "Password changed successfully");
    }
}
