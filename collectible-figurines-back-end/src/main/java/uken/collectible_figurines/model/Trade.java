package uken.collectible_figurines.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "trade")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Trade {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "initiator_id", nullable = false)
  private User initiator;

  @ManyToOne
  @JoinColumn(name = "recipient_id", nullable = false)
  private User recipient;

  @Column(name = "status", nullable = false)
  private String status;

  @OneToMany(mappedBy = "trade", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<TradeItem> tradeItems = new ArrayList<>();

  public List<TradeItem> getTradeItems() {
    return tradeItems;
  }

  public void setTradeItems(List<TradeItem> tradeItems) {
    this.tradeItems = tradeItems;
  }
  public List<TradeItem> getInitiatorFigures() {
    return tradeItems.stream()
      .filter(item -> item.getOwner().getId().equals(this.initiator.getId()))
      .collect(Collectors.toList());
  }

  public List<TradeItem> getRecipientFigures() {
    return tradeItems.stream()
      .filter(item -> item.getOwner().getId().equals(this.recipient.getId()))
      .collect(Collectors.toList());
  }

  public List<Figurine> getInitiatorFigurines() {
    return tradeItems.stream()
      .filter(item -> item.getOwner().getId().equals(this.initiator.getId()))
      .map(TradeItem::getFigurine)
      .collect(Collectors.toList());
  }

  public List<Figurine> getRecipientFigurines() {
    return tradeItems.stream()
      .filter(item -> item.getOwner().getId().equals(this.recipient.getId()))
      .map(TradeItem::getFigurine)
      .collect(Collectors.toList());
  }
}

