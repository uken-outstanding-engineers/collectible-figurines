package uken.collectible_figurines.services.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import uken.collectible_figurines.model.Figurine;
import uken.collectible_figurines.repository.FigurineRepository;
import uken.collectible_figurines.repository.UserFigurineListItemRepository;
import uken.collectible_figurines.services.FigurineService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FigurineServiceImpl implements FigurineService {
  private final FigurineRepository figurineRepository;
  private final Path uploadDir = Paths.get("uploads");
  @Autowired
  private UserFigurineListItemRepository userFigurineListItemRepository;

  @Override
  public List<Figurine> getAllFigurines() {
    return figurineRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
  }

  @Override
  public Figurine saveFigurine(Figurine figurine, MultipartFile imageFile, MultipartFile hoverImageFile) throws IOException {
    if (imageFile != null && !imageFile.isEmpty()) {
      String imageUrl = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
      Path uploadPath = Paths.get("uploads/figurines-images");

      if (!Files.exists(uploadPath)) {
        Files.createDirectories(uploadPath);
      }

      Path filePath = uploadPath.resolve(imageUrl);
      Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
      figurine.setImageUrl("/api/images/figurines-images/" + imageUrl);
    }

    if (hoverImageFile  != null && !hoverImageFile .isEmpty()) {
      String hoverImageURL = UUID.randomUUID().toString() + "_" + hoverImageFile.getOriginalFilename();
      Path hoverUploadPath = Paths.get("uploads/figurines-images");

      if (!Files.exists(hoverUploadPath)) {
        Files.createDirectories(hoverUploadPath);
      }

      Path filePath = hoverUploadPath.resolve(hoverImageURL);
      Files.copy(hoverImageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
      figurine.setHoverImageUrl("/api/images/figurines-images/" + hoverImageURL);
    }

    return figurineRepository.save(figurine);
  }

  @Transactional
  public void deleteFigurineById(Long id) {
    Figurine figurine = figurineRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Figurine not found with id: " + id));

    userFigurineListItemRepository.deleteByFigurineId(id);

    if (figurine.getImageUrl() != null && !figurine.getImageUrl().isEmpty()) {
      Path imagePath = Paths.get("uploads/figurines-images", Paths.get(figurine.getImageUrl()).getFileName().toString());

      try {
        Files.deleteIfExists(imagePath);
      } catch (IOException e) {
        throw new RuntimeException("Failed to delete image file: " + imagePath, e);
      }
    }

    if (figurine.getHoverImageUrl() != null && !figurine.getHoverImageUrl().isEmpty()) {
      Path hoverImagePath = Paths.get("uploads/figurines-images", Paths.get(figurine.getHoverImageUrl()).getFileName().toString());
      try {
        Files.deleteIfExists(hoverImagePath);
      } catch (IOException e) {
        throw new RuntimeException("Failed to delete hover image file: " + hoverImagePath, e);
      }
    }

    figurineRepository.deleteById(id);
  }

  public Figurine getFigurineById(Long id) {
    return figurineRepository.findById(id).orElse(null);
  }

  public int getTotalFigurines() { return (int) figurineRepository.count(); }

  public long countByTypeForFigurine(Long figurineId, String listType) {
    return userFigurineListItemRepository.countByTypeForFigurine(figurineId, listType);
  }
}
