package uken.collectible_figurines.services;

import uken.collectible_figurines.model.Message;
import uken.collectible_figurines.model.User;
import uken.collectible_figurines.model.dto.MessageDTO;
import uken.collectible_figurines.model.dto.PublicUserDTO;

import java.util.List;
import java.util.Set;

public interface MessageService {
  List<MessageDTO> getMessagesBetweenUsers(Long userId1, Long userId2);
  List<PublicUserDTO> getUsersInConversationWith(Long userId);
  Message saveMessage(MessageDTO dto);
  int countUnreadMessage(Long recipientId);
  void markAllAsRead(Long userId);
}
