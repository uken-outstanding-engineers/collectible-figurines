package uken.collectible_figurines.mapper;

import org.springframework.stereotype.Component;
import uken.collectible_figurines.model.Message;
import uken.collectible_figurines.model.User;
import uken.collectible_figurines.model.dto.MessageDTO;
import uken.collectible_figurines.model.dto.PublicUserDTO;

@Component
public class MessageMapper {
  public PublicUserDTO toPublicUserDTO(User user) {
    if (user == null) return null;
    return new PublicUserDTO(
      user.getId(),
      user.getUsername(),
      user.getAvatarUrl()
    );
  }

  public MessageDTO toMessageDTO(Message message) {
    if (message == null) return null;

    return new MessageDTO(
      message.getId(),
      toPublicUserDTO(message.getSenderId()),
      toPublicUserDTO(message.getRecipientId()),
      message.getContent(),
      message.getDate(),
      message.isSeen()
    );
  }
}
