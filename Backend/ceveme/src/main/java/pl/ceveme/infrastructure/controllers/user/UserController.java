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
    private final UploadCvFileUseCase uploadCvFileUseCase;
    private final DeleteUserUseCase deleteUserUseCase;

    public UserController(ChangeUsersPasswordUseCase changeUsersPasswordUseCase, ChangeUserNameUseCase changeUserNameUseCase, ChangeUserSurnameUseCase changeUserSurnameUseCase, ChangeUserPhoneNumberUseCase changeUserPhoneNumberUseCase, ChangeUserEmailUseCase changeUserEmailUseCase, UploadProfileImageUseCase uploadProfileImageUseCase, UploadCvFileUseCase uploadCvFileUseCase, DeleteUserUseCase deleteUserUseCase) {
        this.changeUsersPasswordUseCase = changeUsersPasswordUseCase;
        this.changeUserNameUseCase = changeUserNameUseCase;
        this.changeUserSurnameUseCase = changeUserSurnameUseCase;
        this.changeUserPhoneNumberUseCase = changeUserPhoneNumberUseCase;
        this.changeUserEmailUseCase = changeUserEmailUseCase;
        this.uploadProfileImageUseCase = uploadProfileImageUseCase;
        this.uploadCvFileUseCase = uploadCvFileUseCase;
        this.deleteUserUseCase = deleteUserUseCase;
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

    @PostMapping(value = "/upload/profileImage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadFileResponse> uploadProfilePhoto(@RequestParam MultipartFile multipartFile, @RequestParam String email) throws IOException {
        UploadFileResponse response = uploadProfileImageUseCase.execute(multipartFile,email);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/upload/cvFile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadFileResponse> uploadCvFile(@RequestParam MultipartFile multipartFile, @RequestParam String email, @RequestParam Long jobOfferId) throws IOException {
        UploadFileResponse response = uploadCvFileUseCase.execute(multipartFile,email,jobOfferId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<DeleteUserResponse> deleteUser(@PathVariable Long userId, @RequestBody DeleteUserRequest request) {
        DeleteUserResponse response = deleteUserUseCase.execute(request);
        return  ResponseEntity.ok(response);
    }

}