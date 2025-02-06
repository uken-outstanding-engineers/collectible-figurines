package uken.collectible_figurines.controllers;

import org.springframework.web.bind.annotation.*;


import uken.collectible_figurines.model.Figurine;
import uken.collectible_figurines.services.FigurineService;

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
  public Figurine addFigurine(@RequestBody Figurine figurine) {
    if (figurine.getId() != null) {
      figurine.setId(null);
    }
    return figurineService.saveFigurine(figurine);
  }

  @PutMapping("/edit/{id}")
  public Figurine updateFigurine(@PathVariable Long id, @RequestBody Figurine updatedFigurine) {
    Figurine figurine = figurineService.getFigurineById(id);

    figurine.setName(updatedFigurine.getName());
    figurine.setSeries(updatedFigurine.getSeries());
    figurine.setImageUrl(updatedFigurine.getImageUrl());
    figurine.setHoverImageUrl(updatedFigurine.getHoverImageUrl());
    figurine.setChase(updatedFigurine.getChase());
    figurine.setGlowInDark(updatedFigurine.getGlowInDark());
    figurine.setFlocked(updatedFigurine.getFlocked());
    figurine.setExclusive(updatedFigurine.getExclusive());
    figurine.setFandomId(updatedFigurine.getFandomId());

    return figurineService.saveFigurine(figurine);
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
