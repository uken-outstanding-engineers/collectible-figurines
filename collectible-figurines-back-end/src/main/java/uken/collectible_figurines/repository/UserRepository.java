package uken.collectible_figurines.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uken.collectible_figurines.model.Figurine;
import uken.collectible_figurines.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

  User findByUsername(String username);
  User findByEmail(String email);
}
