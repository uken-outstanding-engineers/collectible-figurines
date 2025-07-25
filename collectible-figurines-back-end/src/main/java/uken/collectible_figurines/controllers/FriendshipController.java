package uken.collectible_figurines.controllers;

import org.springframework.web.bind.annotation.*;
import uken.collectible_figurines.model.Friendship;
import uken.collectible_figurines.model.User;
import uken.collectible_figurines.repository.FriendshipRepository;
import uken.collectible_figurines.repository.UserRepository;
import uken.collectible_figurines.services.FriendshipService;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/friendships")
public class FriendshipController {
  private final FriendshipService friendshipService;

  public FriendshipController(FriendshipService friendshipService) {
    this.friendshipService = friendshipService;
  }
//  @PostMapping("/add")
//  public String addFriend(@RequestParam Long userId1, @RequestParam Long userId2) {
//    return friendshipService.addFriend(userId1, userId2);
//  }

  @PostMapping("/add")
  public String addFriend(@RequestBody Map<String, Long> payload) {
    Long userId1 = payload.get("userId1");
    Long userId2 = payload.get("userId2");
    return friendshipService.addFriend(userId1, userId2);
  }

  @PostMapping("/remove")
  public String removeFriend(@RequestBody Map<String, Long> request) {
    Long userId1 = request.get("userId1");
    Long userId2 = request.get("userId2");
    return friendshipService.removeFriend(userId1, userId2);
  }

  @GetMapping("/check/{userId1}/{userId2}")
  public boolean checkFriendship(@PathVariable Long userId1, @PathVariable Long userId2) {
    return friendshipService.areFriends(userId1, userId2);
  }

  @GetMapping("/friends/{userId}")
  public List<User> getFriends(@PathVariable Long userId) {
    return friendshipService.getFriends(userId);
  }


}
