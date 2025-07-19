package uken.collectible_figurines.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uken.collectible_figurines.mapper.MessageMapper;
import uken.collectible_figurines.model.Message;
import uken.collectible_figurines.model.User;
import uken.collectible_figurines.model.dto.MessageDTO;
import uken.collectible_figurines.model.dto.PublicUserDTO;
import uken.collectible_figurines.repository.MessageRepository;
import uken.collectible_figurines.repository.UserRepository;
import uken.collectible_figurines.services.MessageService;

import java.util.*;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

  private final MessageRepository messageRepository;
  private final MessageMapper messageMapper;
  private final UserRepository userRepository;

  public List<PublicUserDTO> getUsersInConversationWith(Long userId) {
    List<Message> messages = messageRepository.findAllBySenderId_IdOrRecipientId_Id(userId, userId);

    Map<Long, Message> latestMessageMap = new HashMap<>();

    for (Message msg : messages) {
      User otherUser = msg.getSenderId().getId().equals(userId) ? msg.getRecipientId() : msg.getSenderId();
      Long otherUserId = otherUser.getId();

      Message existing = latestMessageMap.get(otherUserId);
      if (existing == null || msg.getDate().isAfter(existing.getDate())) {
        latestMessageMap.put(otherUserId, msg);
      }
    }

    return latestMessageMap.values().stream()
      .sorted(Comparator.comparing(Message::getDate).reversed())
      .map(msg -> {
        User user = msg.getSenderId().getId().equals(userId) ? msg.getRecipientId() : msg.getSenderId();
        return new PublicUserDTO(user.getId(), user.getUsername(), user.getAvatarUrl());
      })
      .toList();
  }

  public List<MessageDTO> getMessagesBetweenUsers(Long userId1, Long userId2) {
    List<Message> messages = messageRepository.findConversationBetweenUsers(userId1, userId2);
    return messages.stream()
      .map(messageMapper::toMessageDTO)
      .toList();
  }


  public Message saveMessage(Message message) {
    return messageRepository.save(message);
  }

}
