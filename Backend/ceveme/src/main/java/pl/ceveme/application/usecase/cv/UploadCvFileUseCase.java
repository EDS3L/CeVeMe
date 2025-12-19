package pl.ceveme.application.usecase.cv;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.ceveme.application.dto.cloud.UploadFileResponse;
import pl.ceveme.domain.model.entities.Cv;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.CvRepository;
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
    private final CvRepository cvRepository;

    public UploadCvFileUseCase(CloudinaryService cloudinaryService, UserRepository userRepository, JobOfferRepository jobOfferRepository, CvRepository cvRepository) {
        this.cloudinaryService = cloudinaryService;
        this.userRepository = userRepository;
        this.jobOfferRepository = jobOfferRepository;
        this.cvRepository = cvRepository;
    }

    @Transactional
    public UploadFileResponse execute(MultipartFile multipartFile, Long userId, String jobOfferLink) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));


        UploadFileResponse response = cloudinaryService.uploadCvFile(multipartFile);

        JobOffer jobOffer = jobOfferRepository.findByLink(jobOfferLink)
                .orElseThrow(() -> new IllegalArgumentException("Job offer not found"));

        Cv cv = new Cv(response.url(), LocalDate.now(),jobOffer,user,null);

        user.getCvList().add(cv);

        cvRepository.save(cv);
        userRepository.save(user);

        return new UploadFileResponse(response.filename(),response.url(),response.message(),cv.getId());
    }
}
