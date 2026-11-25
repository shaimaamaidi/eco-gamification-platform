package com.whitecape.ecoplateform.service;

import com.whitecape.ecoplateform.exception.ErrorCodes;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLConnection;
import java.nio.file.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class ImageService {

    public static String saveImage(String UPLOAD_DIR, String prefixe, byte[] image,String extension) {
        try {
            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            String hash = getSHA256Hash(image);

            String fileName = prefixe + hash +"."+ extension;
            Path filePath = Paths.get(UPLOAD_DIR, fileName);

            if (Files.exists(filePath)) {
                throw new RuntimeException("Image est deja existante.");
            }

            Files.write(filePath, image);

            return filePath.toString();
        } catch (IOException | NoSuchAlgorithmException e) {
            throw new RuntimeException("Erreur lors de la sauvegarde de l'image. Réessayez plus tard." );
        }
    }

    public static MultipartFile getImageAsMultipartFile(String path) {
        try {
            FileInputStream inputStream = new FileInputStream(path);
            Path path1 = Paths.get(path);
            String fileName = path1.getFileName().toString();

            return new MockMultipartFile(
                    "file",
                    fileName,
                    Files.probeContentType(path1),
                    inputStream
            );
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la lecture de l'image. Réessayez plus tard.");
        }
    }

    public static String updateImage(String uploadDir, String prefixe, String path, byte[] image,String extension) {
        String newPath;
        try {
            newPath = saveImage(uploadDir, prefixe, image, extension);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Image est deja existante.")) {
                throw e;
            }
            throw new RuntimeException("Erreur lors de la mise à jour de l'image. Réessayez plus tard.");
        }

        if (path != null) {
            try {
                Path oldImagePath = Paths.get(path);
                if (Files.exists(oldImagePath)) {
                    Files.delete(oldImagePath);
                }
            } catch (IOException e) {
                throw new RuntimeException("Erreur lors de la suppression de l'ancienne image.");
            }
        }

        return newPath;
    }

    public static void deleteImage(String path) {
        if (path != null) {
            try {
                Path oldImagePath = Paths.get(path);
                if (Files.exists(oldImagePath)) {
                    Files.delete(oldImagePath);
                }
            } catch (IOException e) {
                throw new RuntimeException("Erreur lors de la suppression de l'image. Réessayez plus tard.");
            }
        }
    }

    private static String getSHA256Hash(byte[] data) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(data);
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
    public static String detectExtension(byte[] imageBytes){
        String mimeType = null;
        try {
            mimeType = URLConnection.guessContentTypeFromStream(new ByteArrayInputStream(imageBytes));
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de recherche de l'image. Réessayez plus tard.");
        }
        if (mimeType == null) {
            return "png";
        }

        switch (mimeType) {
            case "image/jpeg":
                return "jpg";
            case "image/png":
                return "png";
            case "image/gif":
                return "gif";
            default:
                return "png";
        }
    }
}
