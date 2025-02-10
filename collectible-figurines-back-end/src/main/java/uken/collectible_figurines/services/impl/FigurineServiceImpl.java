package uken.collectible_figurines.services.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import uken.collectible_figurines.model.Figurine;
import uken.collectible_figurines.repository.FigurineRepository;
import uken.collectible_figurines.repository.UserFigurineListItemRepository;
import uken.collectible_figurines.services.FigurineService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FigurineServiceImpl implements FigurineService {
  private final FigurineRepository figurineRepository;
  @Autowired
  private UserFigurineListItemRepository userFigurineListItemRepository;

  @Override
  public List<Figurine> getAllFigurines() {
    return figurineRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
  }

  public Figurine saveFigurine(Figurine figurine) {
    return figurineRepository.save(figurine);
  }

  @Transactional
  public void deleteFigurineById(Long id) {
    userFigurineListItemRepository.deleteByFigurineId(id);
    figurineRepository.deleteById(id);
  }

  public Figurine getFigurineById(Long id) {
    return figurineRepository.findById(id).orElse(null);
  }

  public int getTotalFigurines() { return (int) figurineRepository.count(); }
}
