package uken.collectible_figurines.services.impl;

import org.springframework.stereotype.Service;
import uken.collectible_figurines.model.Figurine;
import uken.collectible_figurines.repository.FigurineRepository;
import uken.collectible_figurines.services.RecommendationService;

import java.util.*;

@Service
public class RecommendationServiceImpl implements RecommendationService {
  private final FigurineRepository figurineRepository;

  public RecommendationServiceImpl(FigurineRepository figurineRepository) {
    this.figurineRepository = figurineRepository;
  }
  public List<Figurine> recommendFigurines(Long id) {
    Figurine targetFigurine = figurineRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Figurine doesn't exist"));

    List<Figurine> allFigurines = figurineRepository.findAll();

    allFigurines.remove(targetFigurine);

    allFigurines.sort((f1, f2) -> Double.compare(
      calculateSimilarity(targetFigurine, f2),
      calculateSimilarity(targetFigurine, f1)
    ));

    int limit = Math.min(12, allFigurines.size());
    return allFigurines.subList(0, limit);
  }

  private double calculateSimilarity(Figurine figurine1, Figurine figurine2) {
    double similarity = 0.0;

    similarity += (Objects.equals(figurine1.getChase(), figurine2.getChase()) ? 1 : 0);
    similarity += (Objects.equals(figurine1.getGlowInDark(), figurine2.getGlowInDark()) ? 1 : 0);
    similarity += (Objects.equals(figurine1.getFlocked(), figurine2.getFlocked()) ? 1 : 0);
    similarity += (Objects.equals(figurine1.getExclusive(), figurine2.getExclusive()) ? 1 : 0);

    similarity += (Objects.equals(figurine1.getSeries(), figurine2.getSeries()) ? 3 : 0);

    similarity += (Objects.equals(figurine1.getFandomId(), figurine2.getFandomId()) ? 3 : 0);

    similarity += (Objects.equals(figurine1.getName(), figurine2.getName()) ? 1 : 0);

    return similarity / 11.0;
  }
}
