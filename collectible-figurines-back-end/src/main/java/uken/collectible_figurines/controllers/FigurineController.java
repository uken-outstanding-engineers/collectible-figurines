package uken.collectible_figurines.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import uken.collectible_figurines.model.Figurine;
import uken.collectible_figurines.services.FigurineService;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/figures")
public class FigurineController {
  private final FigurineService figurineService;

  public FigurineController(FigurineService figurineService) {
    this.figurineService = figurineService;
  }

  @GetMapping("/all")
  public List<Figurine> getAllFigures() {
    return figurineService.getAllFigurines();
  }
}
