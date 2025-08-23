package pl.ceveme.infrastructure.external.cloud;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.ceveme.application.dto.cloud.UploadFileResponse;

import java.io.IOException;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;
    private final FileManager fileManager;

    public CloudinaryService(@Value("${CLOUDINARY_URL}") String apiKey, FileManager fileManager) {
        this.cloudinary = new Cloudinary(apiKey);
        this.fileManager = fileManager;
    }


    public UploadFileResponse uploadProfileImage(MultipartFile multipartFile) throws IOException {
        ImageValidator.validateProfilePhoto(multipartFile);
        return fileManager.uploadProfileImage(multipartFile, cloudinary);

    }

    public UploadFileResponse uploadCvFile(MultipartFile multipartFile) throws IOException {
        ImageValidator.validateCvFile(multipartFile);
        return fileManager.uploadProfileImage(multipartFile, cloudinary);
    }


}
