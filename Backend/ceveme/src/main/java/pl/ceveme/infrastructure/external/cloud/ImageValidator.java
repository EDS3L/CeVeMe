package pl.ceveme.infrastructure.external.cloud;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;

public class ImageValidator {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final String[] profilePhotoExtensions = {"jpg", "jpeg", "png", "webp","heic","avif", "tiff"};

    public static void validateProfilePhoto(MultipartFile multipartFile) throws IOException {

        if (multipartFile == null) throw new IOException("Profile photo cannot be null!");
        if (multipartFile.getSize() > MAX_FILE_SIZE) throw new IOException("File size cannot exceed 10MB");
        if (Arrays.stream(profilePhotoExtensions)
                .noneMatch(ext -> ext.equalsIgnoreCase(getFileExtension(multipartFile)))) {
            throw new IOException("Unsupported file extension!");
        }
    }

    public static void validateCvFile(MultipartFile multipartFile) throws IOException {

        if (multipartFile == null) throw new IOException("Cv file cannot be null!");
        if (multipartFile.getSize() > MAX_FILE_SIZE) throw new IOException("File size cannot exceed 10MB");
        if(!getFileExtension(multipartFile).equals("pdf")) throw new IOException("Unsupported file extension!");

    }



    private static String getFileExtension(MultipartFile multipartFile) {
        String name = multipartFile.getOriginalFilename();
        assert name != null;
        int lastDot = name.lastIndexOf('.');
        if (lastDot == -1 || lastDot == name.length() - 1) {
            return "";
        }
        return name.substring(lastDot + 1).toLowerCase();
    }
}
