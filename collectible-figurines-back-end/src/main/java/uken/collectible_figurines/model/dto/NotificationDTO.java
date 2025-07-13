package uken.collectible_figurines.model.dto;

import java.time.LocalDateTime;

public class NotificationDTO {

  private Long id;
  private String type;
  private boolean seen;
  private LocalDateTime date;
  private PublicUserDTO sender;
  private PublicUserDTO recipient;

  public NotificationDTO() {
  }

  public NotificationDTO(Long id, String type, boolean seen, LocalDateTime date,
                         PublicUserDTO sender, PublicUserDTO recipient) {
    this.id = id;
    this.type = type;
    this.seen = seen;
    this.date = date;
    this.sender = sender;
    this.recipient = recipient;
  }

  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }
  public String getType() {
    return type;
  }
  public void setType(String type) {
    this.type = type;
  }
  public boolean isSeen() {
    return seen;
  }
  public void setSeen(boolean seen) {
    this.seen = seen;
  }
  public LocalDateTime getDate() {
    return date;
  }
  public void setDate(LocalDateTime date) {
    this.date = date;
  }
  public PublicUserDTO getSender() {
    return sender;
  }
  public void setSender(PublicUserDTO sender) {
    this.sender = sender;
  }
  public PublicUserDTO getRecipient() {
    return recipient;
  }
  public void setRecipient(PublicUserDTO recipient) {
    this.recipient = recipient;
  }
}
