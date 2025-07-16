package uken.collectible_figurines.controllers;

import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;
import uken.collectible_figurines.model.Figurine;
import uken.collectible_figurines.repository.FigurineRepository;
import uken.collectible_figurines.services.ActivityLogsService;
import uken.collectible_figurines.services.FigurineService;
import uken.collectible_figurines.services.RecommendationService;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/figurines")
public class FigurineController {
  private final FigurineService figurineService;
  private final RecommendationService recommendationService;
  private final ActivityLogsService activityLogsService;
  private final FigurineRepository figurineRepository;
  public FigurineController(FigurineService figurineService,
                            RecommendationService recommendationService,
                            ActivityLogsService activityLogsService,
                            FigurineRepository figurineRepository)
  {
    this.figurineService = figurineService;
    this.recommendationService = recommendationService;
    this.activityLogsService = activityLogsService;
    this.figurineRepository = figurineRepository;
  }

  @GetMapping("/all")
  public List<Figurine> getAllFigures() {
    return figurineService.getAllFigurines();
  }

  @PostMapping("/add")
  public Figurine addFigurine(@RequestPart("figurine") Figurine figurine,
                              @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
                              @RequestPart(value = "hoverImageFile", required = false) MultipartFile hoverImageFile,
                              @RequestParam("userId") Long userId) throws IOException {

    Figurine savedFigurine = figurineService.saveFigurine(figurine, imageFile, hoverImageFile);

    activityLogsService.logAction(userId, "ADD_FIGURINE", savedFigurine.getName());

    return savedFigurine;
  }


  @PutMapping("/edit/{id}")
  public Figurine updateFigurine(@PathVariable Long id,
                                 @RequestPart("figurine") Figurine updatedFigurine,
                                 @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
                                 @RequestPart(value = "hoverImageFile", required = false) MultipartFile hoverImageFile,
                                 @RequestParam("userId") Long userId) throws IOException {
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

    Figurine savedFigurine = figurineService.saveFigurine(existingFigurine, imageFile, hoverImageFile);

    activityLogsService.logAction(userId, "EDIT_FIGURINE", savedFigurine.getName());

    return savedFigurine;
  }

  @DeleteMapping("/delete/{id}/{userId}")
  public void deleteFigurine(@PathVariable Long id, @PathVariable Long userId) {
    Optional<Figurine> figurineOpt = figurineRepository.findById(id);

    if (figurineOpt.isPresent()) {
      Figurine figurine = figurineOpt.get();

      activityLogsService.logAction(userId, "DELETE_FIGURINE", figurine.getName());

      figurineService.deleteFigurineById(id);
    } else {
      throw new RuntimeException("Figurine doesn't exist!");
    }
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

  @GetMapping("/recommend/{id}")
  public List<Figurine> recommendFigurines(@PathVariable Long id) {
    return recommendationService.recommendFigurines(id);
  }

}
