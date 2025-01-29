package uken.collectible_figurines.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uken.collectible_figurines.model.Figurine;
import uken.collectible_figurines.repository.FigurineRepository;
import uken.collectible_figurines.services.FigurineService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FigurineServiceImpl implements FigurineService {
  private final FigurineRepository figurineRepository;

  @Override
  public List<Figurine> getAllFigurines() {
    return figurineRepository.findAll();
  }

  public Figurine saveFigurine(Figurine figurine) {
    return figurineRepository.save(figurine);
  }

  public void deleteFigurineById(Long id) {
    figurineRepository.deleteById(id);
  }
}
