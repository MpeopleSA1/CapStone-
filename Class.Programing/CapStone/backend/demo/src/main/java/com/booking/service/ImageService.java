package com.booking.service;

import com.booking.entity.Image;
import com.booking.entity.User;
import com.booking.repository.ImageRepository;
import com.booking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ImageService {

    private final ImageRepository imageRepository;
    private final UserRepository userRepository;

    @Value("${app.upload.dir:uploads/}")
    private String uploadDir;

    public ImageService(ImageRepository imageRepository, UserRepository userRepository) {
        this.imageRepository = imageRepository;
        this.userRepository = userRepository;
    }

    public List<Image> uploadImages(List<MultipartFile> files, String category, Long photographerId) {
        User photographer = userRepository.findById(photographerId)
                .orElseThrow(() -> new RuntimeException("Photographer not found"));

        List<Image> uploadedImages = new ArrayList<>();

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            try {
                Files.createDirectories(uploadPath);
            } catch (IOException e) {
                throw new RuntimeException("Could not create upload directory", e);
            }
        }

        for (MultipartFile file : files) {
            try {
                // Generate unique filename
                String originalFilename = file.getOriginalFilename();
                String fileExtension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

                // Save file to disk
                Path filePath = uploadPath.resolve(uniqueFilename);
                Files.copy(file.getInputStream(), filePath);

                // Create image entity
                Image image = new Image();
                image.setFilename(uniqueFilename);
                image.setOriginalName(originalFilename);
                image.setUrl("/uploads/" + uniqueFilename);
                image.setCategory(category);
                image.setPhotographer(photographer);

                uploadedImages.add(imageRepository.save(image));

            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image: " + file.getOriginalFilename(), e);
            }
        }

        return uploadedImages;
    }

    public List<Image> getImagesByPhotographer(Long photographerId) {
        return imageRepository.findByPhotographerIdOrderByCreatedAtDesc(photographerId);
    }

    public List<Image> getAllImages() {
        return imageRepository.findAll();
    }

    public List<Image> getImagesByCategory(String category) {
        return imageRepository.findByCategory(category);
    }

    public void deleteImage(Long imageId, Long photographerId) {
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        // Check if the image belongs to the photographer
        if (!image.getPhotographer().getId().equals(photographerId)) {
            throw new RuntimeException("You don't have permission to delete this image");
        }

        // Delete physical file
        try {
            Path filePath = Paths.get(uploadDir + image.getFilename());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            System.err.println("Could not delete file: " + image.getFilename());
        }

        // Delete database record
        imageRepository.delete(image);
    }

    public Image getImageById(Long id) {
        return imageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found"));
    }
}