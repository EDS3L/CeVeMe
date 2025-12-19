package pl.ceveme.application.usecase.user;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.user.ChangePasswordRequest;
import pl.ceveme.application.dto.user.ChangePasswordResponse;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.UserRepository;
import pl.ceveme.infrastructure.adapter.security.BCryptPasswordEncoderAdapter;

import java.nio.file.AccessDeniedException;

@Service
public class ChangeUsersPasswordUseCase {


    private final UserRepository userRepository;
    private final BCryptPasswordEncoderAdapter bCryptPasswordEncoderAdapter;

    public ChangeUsersPasswordUseCase(UserRepository userRepository, BCryptPasswordEncoderAdapter bCryptPasswordEncoderAdapter) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoderAdapter = bCryptPasswordEncoderAdapter;
    }

    @Transactional
    public ChangePasswordResponse changePassword(ChangePasswordRequest request, Long userId) throws AccessDeniedException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if(user.getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

        user.changePassword(
                request.confirmPassword(),
                request.newPassword(),
                request.confirmNewPassword(),
                bCryptPasswordEncoderAdapter
        );

        return new ChangePasswordResponse(userId, "Password changed successfully");
    }

}