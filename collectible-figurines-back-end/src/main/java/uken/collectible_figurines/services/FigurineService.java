package uken.collectible_figurines.services;


import uken.collectible_figurines.model.Figurine;

import java.util.List;

public interface FigurineService {
  List<Figurine> getAllFigurines();
  Figurine saveFigurine(Figurine figurine);
  void deleteFigurineById(Long id);
}
