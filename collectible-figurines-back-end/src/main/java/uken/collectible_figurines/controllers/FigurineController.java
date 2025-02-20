package uken.collectible_figurines.controllers;

import org.springframework.web.bind.annotation.*;


import org.springframework.web.multipart.MultipartFile;
import uken.collectible_figurines.model.Figurine;
import uken.collectible_figurines.services.FigurineService;

import java.io.File;
import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/figurines")
public class FigurineController {
  private final FigurineService figurineService;

  public FigurineController(FigurineService figurineService) {
    this.figurineService = figurineService;
  }

  @GetMapping("/all")
  public List<Figurine> getAllFigures() {
    return figurineService.getAllFigurines();
  }

  @PostMapping("/add")
  public Figurine addFigurine(@RequestPart("figurine") Figurine figurine,
                              @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
                              @RequestPart(value = "hoverImageFile", required = false) MultipartFile hoverImageFile) throws IOException {
    return figurineService.saveFigurine(figurine, imageFile, hoverImageFile);
  }


  @PutMapping("/edit/{id}")
  public Figurine updateFigurine(@PathVariable Long id,
                                 @RequestPart("figurine") Figurine updatedFigurine,
                                 @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
                                 @RequestPart(value = "hoverImageFile", required = false) MultipartFile hoverImageFile) throws IOException {
    Figurine existingFigurine = figurineService.getFigurineById(id);

    existingFigurine.setName(updatedFigurine.getName());
    existingFigurine.setSeries(updatedFigurine.getSeries());
    existingFigurine.setNumber(updatedFigurine.getNumber());
    existingFigurine.setChase(updatedFigurine.getChase());
    existingFigurine.setGlowInDark(updatedFigurine.getGlowInDark());
    existingFigurine.setFlocked(updatedFigurine.getFlocked());
    existingFigurine.setExclusive(updatedFigurine.getExclusive());
    existingFigurine.setFandomId(updatedFigurine.getFandomId());

    if (imageFile != null && !imageFile.isEmpty()) {
      String imageUrl = existingFigurine.getImageUrl();

      if (imageUrl.startsWith("/api/images/")) {
        imageUrl = imageUrl.replace("/api/images/", "");
      }

      String oldImagePath = "uploads/" + imageUrl;


      File oldImageFile = new File(oldImagePath);
      if (oldImageFile.exists() && oldImageFile.isFile()) {
        boolean deleted = oldImageFile.delete();
        if (!deleted) {
          throw new IOException("Photo deletion failed: " + oldImagePath);
        }
      }
    }

    if (hoverImageFile != null && !hoverImageFile.isEmpty()) {
      String hoverImageUrl = existingFigurine.getHoverImageUrl();

      if (hoverImageUrl.startsWith("/api/images/")) {
        hoverImageUrl = hoverImageUrl.replace("/api/images/", "");
      }

      String oldHoverImagePath = "uploads/" + hoverImageUrl;

      File oldHoverImageFile = new File(oldHoverImagePath);
      if (oldHoverImageFile.exists() && oldHoverImageFile.isFile()) {
        boolean deleted = oldHoverImageFile.delete();
        if (!deleted) {
          throw new IOException("Photo deletion failed: " + oldHoverImagePath);
        }
      }
    }

    return figurineService.saveFigurine(existingFigurine, imageFile, hoverImageFile);
  }

  @DeleteMapping("/delete/{id}")
  public void deleteFigurine(@PathVariable Long id) {
    figurineService.deleteFigurineById(id);
  }

  @GetMapping("/total")
  public int getTotalFigurines() {
    return figurineService.getTotalFigurines();
  }

  @GetMapping("/count/{figurineId}/{listType}")
  public long getCountForFigurineByType(
    @PathVariable Long figurineId,
    @PathVariable String listType
  ) {
    List<String> validTypes = List.of("LIKED", "WANTED", "OWNED");

    if (!validTypes.contains(listType.toUpperCase())) {
      throw new IllegalArgumentException("Invalid list type: " + listType);
    }

    return figurineService.countByTypeForFigurine(figurineId, listType.toUpperCase());
  }


}
