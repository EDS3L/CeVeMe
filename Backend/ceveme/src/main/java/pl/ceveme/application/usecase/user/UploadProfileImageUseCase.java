package pl.ceveme.application.usecase.user;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.ceveme.application.dto.cloud.UploadFileRequest;
import pl.ceveme.application.dto.cloud.UploadFileResponse;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.UserRepository;
import pl.ceveme.infrastructure.external.cloud.CloudinaryService;

import java.io.IOException;

@Service
public class UploadProfileImageUseCase {

    private final CloudinaryService cloudinaryService;
    private final UserRepository userRepository;

    public UploadProfileImageUseCase(CloudinaryService cloudinaryService, UserRepository userRepository) {
        this.cloudinaryService = cloudinaryService;
        this.userRepository = userRepository;
    }

    @Transactional
    public UploadFileResponse execute(MultipartFile multipartFile, String email) throws IOException {
        User user = userRepository.findByEmail(new Email(email))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        UploadFileResponse response = cloudinaryService.upload(multipartFile);
        user.setImage(response.url());
        userRepository.save(user);

        return response;

    }
}
