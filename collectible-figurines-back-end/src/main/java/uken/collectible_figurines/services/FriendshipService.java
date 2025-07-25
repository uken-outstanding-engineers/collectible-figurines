package uken.collectible_figurines.services;

import uken.collectible_figurines.model.User;

import java.util.List;

public interface FriendshipService {
  String addFriend(Long userId1, Long userId2);
  String removeFriend(Long userId1, Long userId2);
  boolean areFriends(Long userId1, Long userId2);
  List<User> getFriends(Long userId);
}
