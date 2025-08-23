package pl.ceveme.application.usecase.user;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.ceveme.application.dto.cloud.UploadFileResponse;
import pl.ceveme.domain.model.entities.Cv;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.JobOfferRepository;
import pl.ceveme.domain.repositories.UserRepository;
import pl.ceveme.infrastructure.external.cloud.CloudinaryService;

import java.io.IOException;
import java.time.LocalDate;

@Service
public class UploadCvFileUseCase {

    private final CloudinaryService cloudinaryService;
    private final UserRepository userRepository;
    private final JobOfferRepository jobOfferRepository;

    public UploadCvFileUseCase(CloudinaryService cloudinaryService, UserRepository userRepository, JobOfferRepository jobOfferRepository) {
        this.cloudinaryService = cloudinaryService;
        this.userRepository = userRepository;
        this.jobOfferRepository = jobOfferRepository;
    }

    @Transactional
    public UploadFileResponse execute(MultipartFile multipartFile, String email, Long jobOfferId, Long userId) throws IOException {
        User user = userRepository.findByEmail(new Email(email))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));


        UploadFileResponse response = cloudinaryService.uploadCvFile(multipartFile);

        JobOffer jobOffer = jobOfferRepository.findById(jobOfferId)
                .orElseThrow(() -> new IllegalArgumentException("Job offer not found"));


        user.getCvList().add(new Cv(response.url(), LocalDate.now(),jobOffer,user,null));

        userRepository.save(user);

        return response;
    }
}
