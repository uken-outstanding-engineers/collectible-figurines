package uken.collectible_figurines.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import uken.collectible_figurines.model.Figurine;
import uken.collectible_figurines.model.User;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

  //User findById(Long id);
  User findByUsername(String username);
  User findByEmail(String email);

  Optional<User> findByUsernameIgnoreCase(String username);
  Optional<User> findByEmailIgnoreCase(String email);

  @Query("SELECT COUNT(u) FROM User u WHERE u.lastLogin >= :lastMonth")
  int countUsersLoggedAfter(LocalDateTime lastMonth);
}
