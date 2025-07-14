package uken.collectible_figurines.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uken.collectible_figurines.model.Friendship;
import uken.collectible_figurines.model.User;
import uken.collectible_figurines.repository.FriendshipRepository;
import uken.collectible_figurines.services.FriendshipService;
import uken.collectible_figurines.repository.UserRepository;
import uken.collectible_figurines.services.NotificationService;

@Service
@RequiredArgsConstructor
public class FriendshipServiceImpl implements FriendshipService {

  private final UserRepository userRepository;
  private final FriendshipRepository friendshipRepository;

  private final NotificationService notificationService;

  public String addFriend(Long userId1, Long userId2) {
    if (userId1.equals(userId2)) {
      return "Nie można dodać siebie samego.";
    }

    User u1 = userRepository.findById(userId1).orElseThrow();
    User u2 = userRepository.findById(userId2).orElseThrow();

    if (friendshipRepository.findBetweenUsers(u1, u2).isPresent()) {
      return "Taka znajomość już istnieje.";
    }

    friendshipRepository.save(new Friendship(u1, u2));
    notificationService.cancelFriendRequest(userId2, userId1);

    return "Dodano znajomość.";
  }
}
