package com.booking.controller;

import com.booking.entity.Image;
import com.booking.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/photographer")
public class ImageController {

    @Autowired
    private ImageService imageService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImages(
            @RequestParam("images") List<MultipartFile> files,
            @RequestParam("category") String category,
            HttpServletRequest request) {

        Long userId = (Long) request.getAttribute("userId");
        List<Image> uploadedImages = imageService.uploadImages(files, category, userId);
        return ResponseEntity.ok(uploadedImages);
    }

    @GetMapping("/images")
    public ResponseEntity<List<Image>> getPhotographerImages(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        List<Image> images = imageService.getImagesByPhotographer(userId);
        return ResponseEntity.ok(images);
    }

    @DeleteMapping("/images/{id}")
    public ResponseEntity<?> deleteImage(@PathVariable Long id, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        imageService.deleteImage(id, userId);
        return ResponseEntity.ok().build();
    }
    @RestController
    @RequestMapping("/api/gallery")
    public class GalleryController {

        @Autowired
        private ImageService imageService;

        @GetMapping("/images")
        public ResponseEntity<List<Image>> getAllImages() {
            return ResponseEntity.ok(imageService.getAllImages());
        }

        @GetMapping("/images/category/{category}")
        public ResponseEntity<List<Image>> getImagesByCategory(@PathVariable String category) {
            return ResponseEntity.ok(imageService.getImagesByCategory(category));
        }
    }
}