package uken.collectible_figurines.services;


import org.springframework.web.multipart.MultipartFile;
import uken.collectible_figurines.model.Figurine;

import java.io.IOException;
import java.util.List;

public interface FigurineService {
  List<Figurine> getAllFigurines();
  //Figurine saveFigurine(Figurine figurine);
  Figurine saveFigurine(Figurine figurine, MultipartFile imageFile, MultipartFile hoverImageFile) throws IOException;
  void deleteFigurineById(Long id);
  Figurine getFigurineById(Long id);
  int getTotalFigurines();
}
