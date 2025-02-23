package uken.collectible_figurines.services;

import uken.collectible_figurines.model.Figurine;

import java.util.List;

public interface RecommendationService {
  List<Figurine> recommendFigurines(Long id);
}
