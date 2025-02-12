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
    return figurineRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
  }

//  public Figurine saveFigurine(Figurine figurine) {
//    return figurineRepository.save(figurine);
//  }

  @Override
  public Figurine saveFigurine(Figurine figurine, MultipartFile imageFile) throws IOException {
    if (imageFile != null && !imageFile.isEmpty()) {
      String filename = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
      Path uploadPath = Paths.get("uploads/figurines-images");

      if (!Files.exists(uploadPath)) {
        Files.createDirectories(uploadPath);
      }

      Path filePath = uploadPath.resolve(filename);
      Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
      System.out.println("File path: " + filePath.toString());
      figurine.setImageUrl("/api/images/figurines-images/" + filename);
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
        System.out.println("Deleted image file: " + imagePath);
      } catch (IOException e) {
        throw new RuntimeException("Failed to delete image file: " + imagePath, e);
      }
    }

    figurineRepository.deleteById(id);
  }

  public Figurine getFigurineById(Long id) {
    return figurineRepository.findById(id).orElse(null);
  }

  public int getTotalFigurines() { return (int) figurineRepository.count(); }
}
