package uken.collectible_figurines.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import uken.collectible_figurines.model.Fandom;
import uken.collectible_figurines.model.Figurine;
import uken.collectible_figurines.repository.FandomRepository;
import uken.collectible_figurines.services.ActivityLogsService;
import uken.collectible_figurines.services.FandomService;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/fandoms")
public class FandomController {
  private final FandomService fandomService;
  private final ActivityLogsService activityLogsService;
  private final FandomRepository fandomRepository;

  public FandomController(FandomService fandomService,
                          ActivityLogsService activityLogsService,
                          FandomRepository fandomRepository)
  {
    this.fandomService = fandomService;
    this.activityLogsService = activityLogsService;
    this.fandomRepository = fandomRepository;
  }

  @GetMapping("/all")
  public List<Fandom> getAllFandoms() {
    return fandomService.getAllFandoms();
  }

  @PostMapping("/add")
  public Fandom addFandom(@RequestPart("fandom") Fandom fandom,
                          @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
                          @RequestParam("userId") Long userId) throws IOException {

    Fandom saveFandom = fandomService.saveFandom(fandom, imageFile);

    activityLogsService.logAction(userId, "ADD_FANDOM", saveFandom.getName());

    return saveFandom;
  }

  @PutMapping("/edit/{id}")
  public Fandom updateFandom(@PathVariable Long id,
                             @RequestPart("fandom") Fandom updatedFandom,
                             @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
                             @RequestParam("userId") Long userId) throws IOException {
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

    Fandom saveFandom = fandomService.saveFandom(existingFandom, imageFile);

    activityLogsService.logAction(userId, "EDIT_FANDOM", saveFandom.getName());

    return saveFandom;
  }

  @DeleteMapping("/delete/{id}/{userId}")
  public void deleteFandom(@PathVariable Long id, @PathVariable Long userId) {
    Optional<Fandom> fandomOpt = fandomRepository.findById(id);

    if (fandomOpt.isPresent()) {
      Fandom fandom = fandomOpt.get();

      activityLogsService.logAction(userId, "DELETE_FANDOM", fandom.getName());

      fandomService.deleteFandomById(id);
    } else {
      throw new RuntimeException("Fandom doesn't exist!");
    }
  }
}
