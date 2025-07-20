package uken.collectible_figurines.mapper;

import org.springframework.stereotype.Component;
import uken.collectible_figurines.model.Message;
import uken.collectible_figurines.model.User;
import uken.collectible_figurines.model.dto.MessageDTO;
import uken.collectible_figurines.model.dto.PublicUserDTO;
import uken.collectible_figurines.repository.UserRepository;

import java.time.LocalDateTime;

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

  public Message toMessage(MessageDTO dto, UserRepository userRepository) {
    if (dto == null) return null;

    User sender = null;
    if (dto.getSender() != null && dto.getSender().getId() != null) {
      sender = userRepository.findById(dto.getSender().getId())
        .orElseThrow(() -> new RuntimeException("Sender not found"));
    }

    User recipient = null;
    if (dto.getRecipient() != null && dto.getRecipient().getId() != null) {
      recipient = userRepository.findById(dto.getRecipient().getId())
        .orElseThrow(() -> new RuntimeException("Recipient not found"));
    }

    Message message = new Message();
    message.setId(dto.getId());
    message.setSenderId(sender);
    message.setRecipientId(recipient);
    message.setContent(dto.getContent());
    message.setDate(dto.getDate() != null ? dto.getDate() : LocalDateTime.now());
    message.setSeen(dto.isSeen());

    return message;
  }
}
