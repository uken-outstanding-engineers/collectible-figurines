package uken.collectible_figurines.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import uken.collectible_figurines.model.Fandom;
import uken.collectible_figurines.model.Figurine;
import uken.collectible_figurines.services.FandomService;

import java.io.File;
import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/fandoms")
public class FandomController {
  private final FandomService fandomService;

  public FandomController(FandomService fandomService) {
        this.fandomService = fandomService;
    }

  @GetMapping("/all")
  public List<Fandom> getAllFandoms() {
    return fandomService.getAllFandoms();
  }

  @PostMapping("/add")
  public Fandom addFandom(@RequestPart("fandom") Fandom fandom,
                          @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) throws IOException {
    return fandomService.saveFandom(fandom, imageFile);
  }

  @PutMapping("/edit/{id}")
  public Fandom updateFandom(@PathVariable Long id,
                             @RequestPart("fandom") Fandom updatedFandom,
                             @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) throws IOException {
    Fandom existingFandom = fandomService.getFandomById(id);

    existingFandom.setName(updatedFandom.getName());
    //existingFandom.setImageUrl(updatedFandom.getImageUrl());

    if (imageFile != null && !imageFile.isEmpty()) {
      String imageUrl = existingFandom.getImageUrl();

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
    return fandomService.saveFandom(existingFandom, imageFile);
  }

  @DeleteMapping("/delete/{id}")
  public void deleteFandom(@PathVariable Long id) {
    fandomService.deleteFandomById(id);
  }
}
