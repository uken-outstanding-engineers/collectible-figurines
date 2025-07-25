package uken.collectible_figurines.services;

import uken.collectible_figurines.model.Notification;
import uken.collectible_figurines.model.dto.NotificationDTO;

import java.util.List;

public interface NotificationService {
  String sendFriendRequest(Long senderId, Long recipientId);
  void sendNotification(Long recipientId, Long senderId, String type);
  boolean friendRequestExists(Long senderId, Long recipientId);
  String cancelFriendRequest(Long senderId, Long recipientId);
  List<NotificationDTO> getNotificationsForUser(Long userId);
  int countUnreadNotifications(Long recipientId);
  void markAllAsRead(Long userId);

}
