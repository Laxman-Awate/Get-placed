package com.placepro.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadDir;

    public FileStorageService(@Value("${app.upload.dir:uploads/admin-resources}") String uploadDir) {
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize upload directory: " + this.uploadDir, e);
        }
    }

    public String store(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store empty file.");
        }
        String originalFilename = file.getOriginalFilename();
        String safeName = originalFilename == null ? "file" : originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
        String uniqueName = UUID.randomUUID() + "_" + safeName;
        Path targetPath = this.uploadDir.resolve(uniqueName);
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
        }
        return targetPath.toString();
    }

    public String storeText(String filename, String content) throws IOException {
        String safeName = filename == null ? "notes.txt" : filename.replaceAll("[^a-zA-Z0-9._-]", "_");
        String uniqueName = UUID.randomUUID() + "_" + safeName;
        Path targetPath = this.uploadDir.resolve(uniqueName);
        Files.writeString(targetPath, content == null ? "" : content);
        return targetPath.toString();
    }

    public byte[] read(String filePath) throws IOException {
        return Files.readAllBytes(Paths.get(filePath));
    }

    public InputStream openStream(String filePath) throws IOException {
        return Files.newInputStream(Paths.get(filePath));
    }
}
