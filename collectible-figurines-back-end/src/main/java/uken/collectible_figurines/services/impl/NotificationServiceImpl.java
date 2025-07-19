package uken.collectible_figurines.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uken.collectible_figurines.mapper.NotificationMapper;
import uken.collectible_figurines.model.Notification;
import uken.collectible_figurines.model.User;
import uken.collectible_figurines.model.dto.NotificationDTO;
import uken.collectible_figurines.model.dto.PublicUserDTO;
import uken.collectible_figurines.repository.NotificationRepository;
import uken.collectible_figurines.repository.UserRepository;
import uken.collectible_figurines.services.NotificationService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

  private final NotificationRepository notificationRepository;
  private final NotificationMapper notificationMapper;
  private final UserRepository userRepository;

  public List<NotificationDTO> getNotificationsForUser(Long userId) {
    List<Notification> notifications = notificationRepository.findAllByRecipientIdOrderByDateDesc(userId);
    return notifications.stream()
      .map(notificationMapper::mapToDto)
      .collect(Collectors.toList());
  }

  public String sendFriendRequest(Long senderId, Long recipientId) {
    User sender = userRepository.findById(senderId).orElse(null);
    User recipient = userRepository.findById(recipientId).orElse(null);

    if (sender == null || recipient == null) {
      return "Invalid sender or recipient ID";
    }

    boolean alreadyExists = notificationRepository.existsBySenderIdAndRecipientIdAndType(
      senderId, recipientId, "FRIEND_REQUEST");

    if (alreadyExists) {
      return "Friend request already sent";
    }

    Notification notification = new Notification();
    notification.setType("FRIEND_REQUEST");
    notification.setSender(sender);
    notification.setRecipient(recipient);
    notification.setSeen(false);
    notification.setDate(LocalDateTime.now());

    notificationRepository.save(notification);

    return "Friend request notification sent";
  }
  public boolean friendRequestExists(Long senderId, Long recipientId) {
    return notificationRepository.existsBySenderIdAndRecipientIdAndType(
      senderId, recipientId, "FRIEND_REQUEST"
    );
  }

  public String cancelFriendRequest(Long senderId, Long recipientId) {
    Optional<Notification> notification = notificationRepository
      .findBySenderIdAndRecipientIdAndType(senderId, recipientId, "FRIEND_REQUEST");

    if (notification.isPresent()) {
      notificationRepository.delete(notification.get());
      return "Friend request canceled";
    } else {
      return "No such friend request found";
    }
  }
}
