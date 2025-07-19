package uken.collectible_figurines.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "sender_id", nullable = true)
  private User sender;

  @ManyToOne
  @JoinColumn(name = "recipient_id")
  private User recipient;

  @Column(name = "type")
  private String type;

  @Column(name = "seen")
  private boolean seen;

  @Column(name = "date")
  private LocalDateTime date;

  public Long getId() { return id; }
  public void setId(Long id) {
    this.id = id;
  }
  public String getType() {
    return type;
  }
  public void setType(String type) {
    this.type = type;
  }
  public User getSender() {
    return sender;
  }
  public void setSender(User sender) {
    this.sender = sender;
  }
  public User getRecipient() {
    return recipient;
  }
  public void setRecipient(User recipient) {
    this.recipient = recipient;
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
}
