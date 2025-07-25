package uken.collectible_figurines.controllers;

import org.springframework.web.bind.annotation.*;
import uken.collectible_figurines.model.Message;
import uken.collectible_figurines.model.User;
import uken.collectible_figurines.model.dto.MessageDTO;
import uken.collectible_figurines.model.dto.PublicUserDTO;
import uken.collectible_figurines.services.MessageService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

  private final MessageService messageService;

  public MessageController(MessageService messageService) {
    this.messageService = messageService;
  }

  @GetMapping("/contacts")
  public List<PublicUserDTO> getUsersInConversationWith(@RequestParam Long userId) {
    return messageService.getUsersInConversationWith(userId);
  }

  @GetMapping("/conversation")
  public List<MessageDTO> getConversation(
    @RequestParam Long userId1,
    @RequestParam Long userId2) {
    return messageService.getMessagesBetweenUsers(userId1, userId2);
  }

  @PostMapping("/send")
  public Message sendMessage(@RequestBody MessageDTO message) {
    return messageService.saveMessage(message);
  }

  @GetMapping("/unread/count/{userId}")
  public int getUnreadMessageCount(@PathVariable Long userId) {
    return messageService.countUnreadMessage(userId);
  }

  @PutMapping("/mark-as-read/{userId}")
  public String markMessagesAsRead(@PathVariable Long userId) {
    messageService.markAllAsRead(userId);
    return "Messages marked as read";
  }
}
