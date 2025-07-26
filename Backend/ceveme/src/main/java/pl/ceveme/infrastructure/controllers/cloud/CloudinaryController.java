package pl.ceveme.infrastructure.controllers.cloud;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import pl.ceveme.application.dto.cloud.UploadFileRequest;
import pl.ceveme.application.dto.cloud.UploadFileResponse;
import pl.ceveme.infrastructure.external.cloud.CloudinaryService;

import java.io.IOException;

@RestController
@RequestMapping("/api/cloud")
public class CloudinaryController {

    private final CloudinaryService cloudinaryService;

    public CloudinaryController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadFileResponse> upload(@RequestParam MultipartFile file) throws IOException {
        return ResponseEntity.ok(cloudinaryService.upload(file));
    }
}
