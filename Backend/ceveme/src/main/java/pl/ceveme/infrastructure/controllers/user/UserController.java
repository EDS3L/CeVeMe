// pl/ceveme/infrastructure/controllers/user/UserController.java
package pl.ceveme.infrastructure.controllers.user;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.ceveme.application.dto.cloud.UploadFileResponse;
import pl.ceveme.application.dto.user.*;
import pl.ceveme.application.usecase.user.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final ChangeUsersPasswordUseCase changeUsersPasswordUseCase;
    private final ChangeUserNameUseCase changeUserNameUseCase;
    private final ChangeUserSurnameUseCase changeUserSurnameUseCase;
    private final ChangeUserPhoneNumberUseCase changeUserPhoneNumberUseCase;
    private final ChangeUserEmailUseCase changeUserEmailUseCase;
    private final UploadProfileImageUseCase uploadProfileImageUseCase;

    public UserController(ChangeUsersPasswordUseCase changeUsersPasswordUseCase, ChangeUserNameUseCase changeUserNameUseCase, ChangeUserSurnameUseCase changeUserSurnameUseCase, ChangeUserPhoneNumberUseCase changeUserPhoneNumberUseCase, ChangeUserEmailUseCase changeUserEmailUseCase, UploadProfileImageUseCase uploadProfileImageUseCase) {
        this.changeUsersPasswordUseCase = changeUsersPasswordUseCase;
        this.changeUserNameUseCase = changeUserNameUseCase;
        this.changeUserSurnameUseCase = changeUserSurnameUseCase;
        this.changeUserPhoneNumberUseCase = changeUserPhoneNumberUseCase;
        this.changeUserEmailUseCase = changeUserEmailUseCase;
        this.uploadProfileImageUseCase = uploadProfileImageUseCase;
    }

    @PatchMapping("/{userId}/password")
    public ResponseEntity<ChangePasswordResponse> changePassword(@PathVariable Long userId, @RequestBody ChangePasswordRequest request) {
        ChangePasswordResponse response = changeUsersPasswordUseCase.changePassword(request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{userId}/name")
    public ResponseEntity<UpdateUserResponse> changeName(@PathVariable Long userId, @RequestBody ChangeNameRequest request) {
        UpdateUserResponse response = changeUserNameUseCase.execute(userId, request.name());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{userId}/surname")
    public ResponseEntity<UpdateUserResponse> changeSurname(@PathVariable Long userId, @RequestBody ChangeSurnameRequest request) {
        UpdateUserResponse response = changeUserSurnameUseCase.execute(userId, request.surname());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{userId}/phone-number")
    public ResponseEntity<UpdateUserResponse> changePhoneNumber(@PathVariable Long userId, @RequestBody ChangePhoneNumberRequest request) {
        UpdateUserResponse response = changeUserPhoneNumberUseCase.execute(userId, request.phoneNumber());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{userId}/email")
    public ResponseEntity<UpdateUserResponse> changeEmail(@PathVariable Long userId, @RequestBody ChangeEmailRequest request) {
        UpdateUserResponse response = changeUserEmailUseCase.execute(userId, request.email());
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadFileResponse> uploadProfilePhoto(@RequestParam MultipartFile multipartFile, @RequestParam String email) throws IOException {
        UploadFileResponse response = uploadProfileImageUseCase.execute(multipartFile,email);
        return ResponseEntity.ok(response);
    }

}