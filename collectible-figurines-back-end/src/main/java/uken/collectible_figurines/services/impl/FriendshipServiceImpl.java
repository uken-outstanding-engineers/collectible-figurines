package uken.collectible_figurines.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uken.collectible_figurines.model.Friendship;
import uken.collectible_figurines.model.User;
import uken.collectible_figurines.repository.FriendshipRepository;
import uken.collectible_figurines.services.FriendshipService;
import uken.collectible_figurines.repository.UserRepository;
import uken.collectible_figurines.services.NotificationService;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FriendshipServiceImpl implements FriendshipService {

  private final UserRepository userRepository;
  private final FriendshipRepository friendshipRepository;

  private final NotificationService notificationService;

  public String addFriend(Long userId1, Long userId2) {
    if (userId1.equals(userId2)) {
      return "You cannot add yourself.";
    }

    User u1 = userRepository.findById(userId1).orElseThrow();
    User u2 = userRepository.findById(userId2).orElseThrow();

    if (friendshipRepository.findBetweenUsers(u1, u2).isPresent()) {
      return "Such friendship already exists.";
    }

    friendshipRepository.save(new Friendship(u1, u2));
    notificationService.cancelFriendRequest(userId2, userId1);
    notificationService.cancelFriendRequest(userId1, userId2); //to delete in future

    return "Friend added.";
  }

  public String removeFriend(Long userId1, Long userId2) {
    User u1 = userRepository.findById(userId1).orElseThrow();
    User u2 = userRepository.findById(userId2).orElseThrow();

    Optional<Friendship> friendship = friendshipRepository.findBetweenUsers(u1, u2);
    if (friendship.isPresent()) {
      friendshipRepository.delete(friendship.get());
      return "Friend deleted.";
    } else {
      return "No connection found.";
    }
  }

  public boolean areFriends(Long userId1, Long userId2) {
    User u1 = userRepository.findById(userId1).orElseThrow();
    User u2 = userRepository.findById(userId2).orElseThrow();
    return friendshipRepository.findBetweenUsers(u1, u2).isPresent();
  }
}
