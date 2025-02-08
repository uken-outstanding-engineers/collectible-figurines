package uken.collectible_figurines.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import uken.collectible_figurines.model.Fandom;
import uken.collectible_figurines.repository.FandomRepository;
import uken.collectible_figurines.services.FandomService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FandomServiceImpl implements FandomService {
  private final FandomRepository fandomRepository;

  @Override
  public List<Fandom> getAllFandoms() {
    return fandomRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
  }
}
