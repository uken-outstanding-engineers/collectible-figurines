package uken.collectible_figurines.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
}
