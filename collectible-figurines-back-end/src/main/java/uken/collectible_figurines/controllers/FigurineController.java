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

  @DeleteMapping("/delete/{id}")
  public void deleteFigurine(@PathVariable Long id) {
    figurineService.deleteFigurineById(id);
  }
}
