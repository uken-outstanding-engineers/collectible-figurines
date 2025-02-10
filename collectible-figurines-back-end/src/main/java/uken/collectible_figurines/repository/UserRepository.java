package uken.collectible_figurines.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import uken.collectible_figurines.model.Figurine;
import uken.collectible_figurines.model.User;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface UserRepository extends JpaRepository<User, Long> {

  //User findById(Long id);
  User findByUsername(String username);
  User findByEmail(String email);

  @Query("SELECT COUNT(u) FROM User u WHERE u.lastLogin >= :lastMonth")
  int countUsersLoggedAfter(LocalDateTime lastMonth);
}
