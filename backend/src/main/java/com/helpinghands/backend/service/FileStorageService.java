package com.helpinghands.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload.path:/uploads}")
    private String uploadPath;

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final String[] ALLOWED_TYPES = {"application/pdf", "image/jpeg", "image/png", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"};

    public String storeFile(MultipartFile file, Integer userId, String documentType) throws IOException {
        validateFile(file);

        String uploadDir = uploadPath + "/" + userId + "/" + documentType;
        Path dirPath = Paths.get(uploadDir);

        if (!Files.exists(dirPath)) {
            Files.createDirectories(dirPath);
        }

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = dirPath.resolve(fileName);
        Files.write(filePath, file.getBytes());

        return "/" + userId + "/" + documentType + "/" + fileName;
    }

    private void validateFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IOException("File size exceeds 10MB limit");
        }

        String contentType = file.getContentType();
        boolean isAllowed = false;
        for (String allowed : ALLOWED_TYPES) {
            if (allowed.equals(contentType)) {
                isAllowed = true;
                break;
            }
        }

        if (!isAllowed) {
            throw new IOException("File type not allowed. Allowed types: PDF, JPEG, PNG, DOC, DOCX");
        }
    }

    public void deleteFile(String filePath) throws IOException {
        Path path = Paths.get(uploadPath, filePath);
        if (Files.exists(path)) {
            Files.delete(path);
        }
    }
}
