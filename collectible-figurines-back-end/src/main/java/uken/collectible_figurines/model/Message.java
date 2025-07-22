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
  private User sender;

  @ManyToOne
  @JoinColumn(name = "recipient_id", nullable = false)
  private User recipient;

  @Column(name = "content")
  private String content;

  @Column(name = "date")
  private LocalDateTime date;

  @Column(name = "seen")
  private boolean seen;

  @ManyToOne
  @JoinColumn(name = "trade_id")
  private Trade trade;


  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }
  public User getSender() { return sender; }
  public void setSender(User sender) { this.sender = sender; }
  public User getRecipient() { return recipient; }
  public void setRecipient(User recipient) { this.recipient = recipient; }
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
  public Trade getTrade() {
    return trade;
  }
  public void setTrade(Trade trade) {
    this.trade = trade;
  }
}
