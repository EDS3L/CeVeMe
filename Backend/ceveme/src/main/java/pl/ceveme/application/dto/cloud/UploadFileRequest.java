package pl.ceveme.application.dto.cloud;

import org.springframework.web.multipart.MultipartFile;

public record UploadFileRequest(MultipartFile multipartFile, String email) {
}
