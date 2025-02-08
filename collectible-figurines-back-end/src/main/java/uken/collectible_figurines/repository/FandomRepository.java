package uken.collectible_figurines.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uken.collectible_figurines.model.Fandom;

public interface FandomRepository extends JpaRepository<Fandom, Long> {
}
