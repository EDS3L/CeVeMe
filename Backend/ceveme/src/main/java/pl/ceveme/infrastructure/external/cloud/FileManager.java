package pl.ceveme.infrastructure.external.cloud;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.ceveme.application.dto.cloud.UploadFileResponse;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.Optional;

@Service
public class FileManager {

    public UploadFileResponse uploadProfileImage(MultipartFile multipartFile, Cloudinary cloudinary) throws IOException {

        File tempFile = null;
        try {
            tempFile = convertToFile(multipartFile);

            Map uploadOptions = ObjectUtils.asMap("resource_type", "auto", "use_filename", true, "unique_filename", false);

            return  createUploadResponse( cloudinary.uploader()
                    .upload(tempFile, uploadOptions));
        } catch (Exception e) {
            throw new IOException("Failed to upload file to Cloudinary: " + e.getMessage(), e);
        } finally {
            if (tempFile != null && tempFile.exists()) {
                try {
                    Files.deleteIfExists(tempFile.toPath());
                } catch (IOException e) {
                    System.err.println("Warning: Could not delete temporary file: " + tempFile.getAbsolutePath());
                }
            }
        }

    }

    private File convertToFile(MultipartFile multipartFile) throws IOException {
        if (multipartFile.isEmpty()) throw new IOException("Multi part file cannot be empty!");
        Path tempFile = Files.createTempFile(null, multipartFile.getOriginalFilename());
        Files.copy(multipartFile.getInputStream(), tempFile, StandardCopyOption.REPLACE_EXISTING);
        return tempFile.toFile();
    }

    private UploadFileResponse createUploadResponse(Map<String, Object> response) throws IOException {
        String originalFilename = Optional.ofNullable(response.get("original_filename"))
                .map(Object::toString)
                .orElse("unknown");

        String url = Optional.ofNullable(response.get("secure_url"))
                .or(() -> Optional.ofNullable(response.get("url")))
                .map(Object::toString)
                .orElseThrow(() -> new IOException("Upload response missing URL"));

        return new UploadFileResponse(originalFilename, url, "Upload successful", null);
    }



}
