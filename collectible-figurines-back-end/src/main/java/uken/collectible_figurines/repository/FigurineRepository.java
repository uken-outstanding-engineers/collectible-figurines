package uken.collectible_figurines.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uken.collectible_figurines.model.Figurine;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;


import java.util.List;

@Repository
public interface FigurineRepository extends JpaRepository<Figurine, Long> {
  List<Figurine> findBySeries(String series);
}
