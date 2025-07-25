package uken.collectible_figurines.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uken.collectible_figurines.model.Friendship;
import uken.collectible_figurines.model.User;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
  Optional<Friendship> findByUser1AndUser2(User user1, User user2);
  default Optional<Friendship> findBetweenUsers(User a, User b) {
    return a.getId() < b.getId() ?
      findByUser1AndUser2(a, b) : findByUser1AndUser2(b, a);
  }
  List<Friendship> findAllByUser1OrUser2(User user1, User user2);
}
