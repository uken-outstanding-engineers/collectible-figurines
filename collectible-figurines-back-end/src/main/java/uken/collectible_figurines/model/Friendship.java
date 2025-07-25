package uken.collectible_figurines.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "friendships",
  uniqueConstraints = @UniqueConstraint(columnNames = {"userId1", "userId2"}))
public class Friendship {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "user_id_1")
  private User user1;

  @ManyToOne
  @JoinColumn(name = "user_id_2")
  private User user2;

  @Column(name = "date")
  private LocalDateTime date = LocalDateTime.now();

  public Friendship() {}

  public Friendship(User user1, User user2) {
    if (user1.getId() < user2.getId()) {
      this.user1 = user1;
      this.user2 = user2;
    } else {
      this.user1 = user2;
      this.user2 = user1;
    }
  }
  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }
  public User getUser1() {
    return user1;
  }
  public void setUser1(User user1) {
    this.user1 = user1;
  }
  public User getUser2() {
    return user2;
  }
  public void setUser2(User user2) {
    this.user2 = user2;
  }
  public LocalDateTime getDate() {
    return date;
  }
  public void setDate(LocalDateTime date) {
    this.date = date;
  }


}
