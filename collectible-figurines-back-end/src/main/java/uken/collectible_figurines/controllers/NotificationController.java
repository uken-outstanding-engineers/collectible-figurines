package uken.collectible_figurines.controllers;

import org.springframework.web.bind.annotation.*;
import uken.collectible_figurines.model.dto.FriendRequestDTO;
import uken.collectible_figurines.model.dto.NotificationDTO;
import uken.collectible_figurines.services.NotificationService;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

  private final NotificationService notificationService;

  public NotificationController(NotificationService notificationService) {
    this.notificationService = notificationService;
  }

  @PostMapping("/friend-request")
  public String sendFriendRequest(@RequestBody FriendRequestDTO request) {
    return notificationService.sendFriendRequest(request.getSenderId(), request.getRecipientId());
  }

  @GetMapping("/friend-request/check")
  public boolean isFriendRequestSent(@RequestParam Long senderId, @RequestParam Long recipientId) {
    return notificationService.friendRequestExists(senderId, recipientId);
  }

  @DeleteMapping("/friend-request")
  public String cancelFriendRequest(@RequestBody FriendRequestDTO request) {
    return notificationService.cancelFriendRequest(request.getSenderId(), request.getRecipientId());
  }

  @GetMapping("/user/{recipientId}")
  public List<NotificationDTO> getUserNotifications(@PathVariable Long recipientId) {
    return notificationService.getNotificationsForUser(recipientId);
  }


//  @GetMapping("/user/{userId}")
//  public List<NotificationDTO> getNotificationsForUser(@PathVariable Long userId) {
//    return notificationService.getNotificationsForUser(userId);
//  }
//
//  @PostMapping
//  public NotificationDTO createNotification(@RequestBody CreateNotificationRequest request) {
//    return notificationService.createNotification(request);
//  }
//
//  @PutMapping("/{id}/seen")
//  public void markAsSeen(@PathVariable Long id) {
//    notificationService.markAsSeen(id);
//  }

}
