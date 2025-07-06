package pl.ceveme.application.usecase.employmentInfo;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.ceveme.application.dto.employmentInfo.EmploymentInfoResponse;
import pl.ceveme.application.mapper.EmploymentInfoMapper;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.UserRepository;

@Service

public class GetEmploymentInfoUseCase {

    private final UserRepository userRepository;
    private final EmploymentInfoMapper mapper;

    public GetEmploymentInfoUseCase(UserRepository userRepository, EmploymentInfoMapper mapper) {
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public EmploymentInfoResponse execute(String email) {
        User user = userRepository.findByEmail(new Email(email))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getEmploymentInfo() == null) {
            throw new IllegalArgumentException("User does not have employment info");
        }

        return mapper.toResponse(user.getEmploymentInfo());
    }
}
