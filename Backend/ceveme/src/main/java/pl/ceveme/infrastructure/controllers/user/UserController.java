package pl.ceveme.infrastructure.controllers.user;

import com.sun.security.auth.UserPrincipal;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.ceveme.application.dto.cloud.UploadFileResponse;
import pl.ceveme.application.dto.user.*;
import pl.ceveme.application.usecase.user.*;
import pl.ceveme.domain.model.entities.User;

import javax.security.auth.Subject;
import java.io.IOException;
import java.net.Authenticator;
import java.nio.file.AccessDeniedException;

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
    private final GetUserDetailsInfoUseCase getUserDetailsInfoUseCase;
    private final ChangeUserNameSurnameCityUseCase changeUserNameSurnameCityUseCase;

    public UserController(ChangeUsersPasswordUseCase changeUsersPasswordUseCase, ChangeUserNameUseCase changeUserNameUseCase, ChangeUserSurnameUseCase changeUserSurnameUseCase, ChangeUserPhoneNumberUseCase changeUserPhoneNumberUseCase, ChangeUserEmailUseCase changeUserEmailUseCase, UploadProfileImageUseCase uploadProfileImageUseCase, UploadCvFileUseCase uploadCvFileUseCase, DeleteUserUseCase deleteUserUseCase, GetUserDetailsInfoUseCase getUserDetailsInfoUseCase, ChangeUserNameSurnameCityUseCase changeUserNameSurnameCityUseCase) {
        this.changeUsersPasswordUseCase = changeUsersPasswordUseCase;
        this.changeUserNameUseCase = changeUserNameUseCase;
        this.changeUserSurnameUseCase = changeUserSurnameUseCase;
        this.changeUserPhoneNumberUseCase = changeUserPhoneNumberUseCase;
        this.changeUserEmailUseCase = changeUserEmailUseCase;
        this.uploadProfileImageUseCase = uploadProfileImageUseCase;
        this.uploadCvFileUseCase = uploadCvFileUseCase;
        this.deleteUserUseCase = deleteUserUseCase;
        this.getUserDetailsInfoUseCase = getUserDetailsInfoUseCase;
        this.changeUserNameSurnameCityUseCase = changeUserNameSurnameCityUseCase;
    }

    @PatchMapping("/password")
    public ResponseEntity<ChangePasswordResponse> changePassword(@RequestBody ChangePasswordRequest request, Authentication authentication) throws AccessDeniedException {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        ChangePasswordResponse response = changeUsersPasswordUseCase.changePassword(request,userId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/name")
    public ResponseEntity<UpdateUserResponse> changeName( @RequestBody ChangeNameRequest request, Authentication authentication) throws AccessDeniedException {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        UpdateUserResponse response = changeUserNameUseCase.execute(userId, request.name());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/surname")
    public ResponseEntity<UpdateUserResponse> changeSurname(@RequestBody ChangeSurnameRequest request, Authentication authentication) throws AccessDeniedException{
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        UpdateUserResponse response = changeUserSurnameUseCase.execute(userId, request.surname());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/phone-number")
    public ResponseEntity<UpdateUserResponse> changePhoneNumber(@RequestBody ChangePhoneNumberRequest request, Authentication authentication) throws AccessDeniedException{
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        UpdateUserResponse response = changeUserPhoneNumberUseCase.execute(userId, request.phoneNumber());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/email")
    public ResponseEntity<UpdateUserResponse> changeEmail(@RequestBody ChangeEmailRequest request, Authentication authentication) throws AccessDeniedException {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        UpdateUserResponse response = changeUserEmailUseCase.execute(userId, request.email());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/city")
    public ResponseEntity<UpdateUserResponse> changeCity(@RequestBody ChangeCityRequest request, Authentication authentication) throws AccessDeniedException {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        UpdateUserResponse response = changeUserEmailUseCase.execute(userId, request.email());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/cityAndNameAndSurname")
    public ResponseEntity<UpdateUserResponse> changeUserNameSurnameCity(@RequestBody ChangeUserNameSurnameCityRequest request, Authentication authentication) throws AccessDeniedException {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        UpdateUserResponse response = changeUserNameSurnameCityUseCase.execute(userId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/upload/profileImage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadFileResponse> uploadProfilePhoto(@RequestParam MultipartFile multipartFile, @RequestParam String email, Authentication authentication) throws AccessDeniedException, IOException {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        UploadFileResponse response = uploadProfileImageUseCase.execute(multipartFile,email, userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/upload/cvFile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadFileResponse> uploadCvFile(@RequestParam MultipartFile multipartFile, @RequestParam String email, @RequestParam Long jobOfferId, Authentication authentication) throws AccessDeniedException, IOException {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        UploadFileResponse response = uploadCvFileUseCase.execute(multipartFile,email,jobOfferId, userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/deleteUser")
    public ResponseEntity<DeleteUserResponse> deleteUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long id = user.getId();

        DeleteUserResponse response = deleteUserUseCase.execute(id);
        return  ResponseEntity.ok(response);
    }

    @GetMapping("/userDetails")
    public ResponseEntity<UserDetailsResponse> userDetails(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long id = user.getId();

        UserDetailsResponse response = getUserDetailsInfoUseCase.execute(id);
        return ResponseEntity.ok(response);
    }

}