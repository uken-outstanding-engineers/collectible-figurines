package uken.collectible_figurines.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import uken.collectible_figurines.model.Fandom;
import uken.collectible_figurines.repository.FandomRepository;
import uken.collectible_figurines.services.FandomService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FandomServiceImpl implements FandomService {
  private final FandomRepository fandomRepository;

  @Override
  public List<Fandom> getAllFandoms() {
    return fandomRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
  }

  public Fandom saveFandom(Fandom fandom, MultipartFile imageFile) throws IOException {
    if (imageFile != null && !imageFile.isEmpty()) {
      String filename = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
      Path uploadPath = Paths.get("uploads/fandoms-images");

      if (!Files.exists(uploadPath)) {
        Files.createDirectories(uploadPath);
      }

      Path filePath = uploadPath.resolve(filename);
      Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
      fandom.setImageUrl("/api/images/fandoms-images/" + filename);
    }
    return fandomRepository.save(fandom);
  }

  public void deleteFandomById(Long id) {
    Fandom fandom = fandomRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Fandom not found with id: " + id));

    if (fandom.getImageUrl() != null && !fandom.getImageUrl().isEmpty()) {
      Path imagePath = Paths.get("uploads/fandoms-images", Paths.get(fandom.getImageUrl()).getFileName().toString());

      try {
        Files.deleteIfExists(imagePath);
      } catch (IOException e) {
        throw new RuntimeException("Failed to delete image file: " + imagePath, e);
      }
    }

    fandomRepository.deleteById(id);
  }

  public Fandom getFandomById(Long id) {
    return fandomRepository.findById(id).orElse(null);
  }
}
