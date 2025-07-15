package uken.collectible_figurines.services;

public interface FriendshipService {
  String addFriend(Long userId1, Long userId2);
  String removeFriend(Long userId1, Long userId2);
  boolean areFriends(Long userId1, Long userId2);
}
