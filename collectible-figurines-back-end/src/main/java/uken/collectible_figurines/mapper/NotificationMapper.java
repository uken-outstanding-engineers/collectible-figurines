package uken.collectible_figurines.mapper;

import org.springframework.stereotype.Component;
import uken.collectible_figurines.model.Notification;
import uken.collectible_figurines.model.dto.NotificationDTO;
import uken.collectible_figurines.model.dto.PublicUserDTO;

@Component
public class NotificationMapper {

  public NotificationDTO mapToDto(Notification notification) {
    PublicUserDTO senderDto = null;
    if (notification.getSender() != null) {
      senderDto = new PublicUserDTO(
        notification.getSender().getId(),
        notification.getSender().getUsername(),
        notification.getSender().getAvatarUrl()
      );
    }

    PublicUserDTO recipientDto = null;
    if (notification.getRecipient() != null) {
      recipientDto = new PublicUserDTO(
        notification.getRecipient().getId(),
        notification.getRecipient().getUsername(),
        notification.getRecipient().getAvatarUrl()
      );
    }

    return new NotificationDTO(
      notification.getId(),
      notification.getType(),
      notification.isSeen(),
      notification.getDate(),
      senderDto,
      recipientDto
    );
  }

}
