package uken.collectible_figurines.controllers;

import org.springframework.web.bind.annotation.*;


import org.springframework.web.multipart.MultipartFile;
import uken.collectible_figurines.model.Figurine;
import uken.collectible_figurines.services.FigurineService;

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

//  @PostMapping("/add")
//  public Figurine addFigurine(@RequestBody Figurine figurine) {
//    if (figurine.getId() != null) {
//      figurine.setId(null);
//    }
//    return figurineService.saveFigurine(figurine);
//  }

  @PostMapping("/add")
  public Figurine addFigurine(@RequestPart("figurine") Figurine figurine,
                              @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) throws IOException {
    return figurineService.saveFigurine(figurine, imageFile);
  }


  @PutMapping("/edit/{id}")
  public Figurine updateFigurine(@PathVariable Long id,
                                 @RequestPart("figurine") Figurine updatedFigurine,
                                 @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) throws IOException {
    Figurine existingFigurine = figurineService.getFigurineById(id);

    existingFigurine.setName(updatedFigurine.getName());
    existingFigurine.setSeries(updatedFigurine.getSeries());
    existingFigurine.setHoverImageUrl(updatedFigurine.getHoverImageUrl());
    existingFigurine.setChase(updatedFigurine.getChase());
    existingFigurine.setGlowInDark(updatedFigurine.getGlowInDark());
    existingFigurine.setFlocked(updatedFigurine.getFlocked());
    existingFigurine.setExclusive(updatedFigurine.getExclusive());
    existingFigurine.setFandomId(updatedFigurine.getFandomId());

    return figurineService.saveFigurine(existingFigurine, imageFile);
  }

  @DeleteMapping("/delete/{id}")
  public void deleteFigurine(@PathVariable Long id) {
    figurineService.deleteFigurineById(id);
  }

  @GetMapping("/total")
  public int getTotalFigurines() {
    return figurineService.getTotalFigurines();
  }
}
