package uken.collectible_figurines.services;

import uken.collectible_figurines.model.Fandom;

import java.util.List;

public interface FandomService {
  List<Fandom> getAllFandoms();

  Fandom saveFandom(Fandom fandom);

  void deleteFandomById(Long id);

  Fandom getFandomById(Long id);
}
