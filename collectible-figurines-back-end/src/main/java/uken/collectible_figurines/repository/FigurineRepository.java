package uken.collectible_figurines.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uken.collectible_figurines.model.Figurine;

@Repository
public interface FigurineRepository extends JpaRepository<Figurine, Long> {
}
