package pl.ceveme.application.usecase.user;


import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.user.ChangeUserNameSurnameCityRequest;
import pl.ceveme.application.dto.user.UpdateUserResponse;

import java.nio.file.AccessDeniedException;

@Service
public class ChangeUserNameSurnameCityUseCase {

    private final ChangeUserCityUseCase changeUserCityUseCase;
    private final ChangeUserNameUseCase changeUserNameUseCase;
    private final ChangeUserSurnameUseCase changeUserSurnameUseCase;

    public ChangeUserNameSurnameCityUseCase(ChangeUserCityUseCase changeUserCityUseCase, ChangeUserNameUseCase changeUserNameUseCase, ChangeUserSurnameUseCase changeUserSurnameUseCase) {
        this.changeUserCityUseCase = changeUserCityUseCase;
        this.changeUserNameUseCase = changeUserNameUseCase;
        this.changeUserSurnameUseCase = changeUserSurnameUseCase;
    }

    @Transactional
    public UpdateUserResponse execute(Long userId, ChangeUserNameSurnameCityRequest request) throws AccessDeniedException {

        changeUserCityUseCase.execute(userId,request.newCity());
        changeUserNameUseCase.execute(userId,request.newName());
        changeUserSurnameUseCase.execute(userId,request.newSurname());

        return new UpdateUserResponse("User name surname city changed successfully", userId);
    }


}
