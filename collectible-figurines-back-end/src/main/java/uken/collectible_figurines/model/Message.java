package uken.collectible_figurines.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_message")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Message {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "sender_id", nullable = false)
  private User senderId;

  @ManyToOne
  @JoinColumn(name = "recipient_id", nullable = false)
  private User recipientId;

  @Column(name = "content")
  private String content;

  @Column(name = "date")
  private LocalDateTime date;

  @Column(name = "seen")
  private boolean seen;

  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }
  public User getSenderId() {
    return senderId;
  }
  public void setSenderId(User senderId) {
    this.senderId = senderId;
  }
  public User getRecipientId() {
    return recipientId;
  }
  public void setRecipient(User recipientId) {
    this.recipientId = recipientId;
  }
  public String getContent() {
    return content;
  }
  public void setContent(String content) {
    this.content = content;
  }
  public LocalDateTime getDate() {
    return date;
  }
  public void setDate(LocalDateTime date) {
    this.date = date;
  }
  public boolean isSeen() {
    return seen;
  }
  public void setSeen(boolean seen) {
    this.seen = seen;
  }
}
