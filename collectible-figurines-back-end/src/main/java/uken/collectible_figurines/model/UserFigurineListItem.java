package uken.collectible_figurines.model;

import jakarta.persistence.*;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_figurine_list_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserFigurineListItem {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "list_id")
  private UserFigurineList list;

  @ManyToOne
  @JoinColumn(name = "figurine_id")
  private Figurine figurine;

  @Column(name = "date")
  private LocalDateTime date;

  public Figurine getFigurine() {
    return figurine;
  }
  public void setFigurine(Figurine figurine) {
    this.figurine = figurine;
  }
  public LocalDateTime getDate() {
    return date;
  }
  public void setDate(LocalDateTime date) {
    this.date = date;
  }
}


