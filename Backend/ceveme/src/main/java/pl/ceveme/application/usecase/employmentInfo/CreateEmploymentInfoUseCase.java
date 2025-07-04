package pl.ceveme.application.usecase.employmentInfo;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.employmentInfo.EmploymentInfoRequest;
import pl.ceveme.application.dto.employmentInfo.EmploymentInfoResponse;
import pl.ceveme.application.mapper.EmploymentInfoMapper;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.*;

@Service
public class CreateEmploymentInfoUseCase {

    private static final Logger log = LoggerFactory.getLogger(CreateEmploymentInfoUseCase.class);

    private final UserRepository userRepository;
    private final EmploymentInfoRepository employmentInfoRepository;

    public CreateEmploymentInfoUseCase(UserRepository userRepository, EmploymentInfoRepository employmentInfoRepository) {
        this.userRepository = userRepository;
        this.employmentInfoRepository = employmentInfoRepository;
    }

    @Transactional
    public EmploymentInfoResponse execute(EmploymentInfoRequest request) {

        User user = userRepository.findByEmail(new Email(request.email()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        EmploymentInfo info = EmploymentInfoMapper.toEntity(request);

        user.setEmploymentInfo(info);
        info.setUser(user);

        userRepository.save(user);



        return EmploymentInfoMapper.toResponse(info, "Successful create your");
    }


}
