package uken.collectible_figurines.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "trade_item")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TradeItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "trade_id", nullable = false)
  private Trade trade;

  @ManyToOne
  @JoinColumn(name = "figure_id", nullable = false)
  private Figurine figurine;

  @ManyToOne
  @JoinColumn(name = "owner_id", nullable = false)
  private User owner;

  public Long getId() {
    return id;
  }
  public Trade getTrade() {
    return trade;
  }
  public Figurine getFigurine() {
    return figurine;
  }
  public User getOwner() {
    return owner;
  }
  public void setId(Long id) {
    this.id = id;
  }
  public void setTrade(Trade trade) {
    this.trade = trade;
  }
  public void setFigurine(Figurine figurine) {
    this.figurine = figurine;
  }
  public void setOwner(User owner) {
    this.owner = owner;
  }

}
