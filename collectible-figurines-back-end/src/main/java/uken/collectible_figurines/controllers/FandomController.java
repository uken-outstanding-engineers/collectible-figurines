package uken.collectible_figurines.controllers;

import org.springframework.web.bind.annotation.*;
import uken.collectible_figurines.model.Fandom;
import uken.collectible_figurines.model.Figurine;
import uken.collectible_figurines.services.FandomService;

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
  public Fandom addFandom(@RequestBody Fandom fandom) {
    if (fandom.getId() != null) {
      fandom.setId(null);
    }
    return fandomService.saveFandom(fandom);
  }

  @PutMapping("/edit/{id}")
  public Fandom updateFandom(@PathVariable Long id, @RequestBody Fandom updatedFandom) {
    Fandom fandom = fandomService.getFandomById(id);

    fandom.setName(updatedFandom.getName());
    fandom.setImageUrl(updatedFandom.getImageUrl());

    return fandomService.saveFandom(fandom);
  }

  @DeleteMapping("/delete/{id}")
  public void deleteFandom(@PathVariable Long id) {
    fandomService.deleteFandomById(id);
  }
}
