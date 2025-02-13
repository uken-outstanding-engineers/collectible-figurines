package uken.collectible_figurines.services;

import org.springframework.web.multipart.MultipartFile;
import uken.collectible_figurines.model.Fandom;

import java.io.IOException;
import java.util.List;

public interface FandomService {
  List<Fandom> getAllFandoms();
  public Fandom saveFandom(Fandom fandom, MultipartFile imageFile) throws IOException;
  void deleteFandomById(Long id);
  Fandom getFandomById(Long id);
}
