package uken.collectible_figurines.mapper;

import org.springframework.stereotype.Component;
import uken.collectible_figurines.model.Figurine;
import uken.collectible_figurines.model.Trade;
import uken.collectible_figurines.model.dto.TradeDTO;
import uken.collectible_figurines.model.TradeItem;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TradeMapper {
  public TradeDTO toTradeDTO(Trade trade) {
    if (trade == null) return null;

    List<Figurine> initiatorFigures = trade.getTradeItems().stream()
      .filter(item -> item.getOwner().getId().equals(trade.getInitiator().getId()))
      .map(TradeItem::getFigurine)
      .collect(Collectors.toList());

    List<Figurine> recipientFigures = trade.getTradeItems().stream()
      .filter(item -> item.getOwner().getId().equals(trade.getRecipient().getId()))
      .map(TradeItem::getFigurine)
      .collect(Collectors.toList());

    return new TradeDTO(
      trade.getId(),
      trade.getStatus(),
      initiatorFigures,
      recipientFigures
    );
  }




}
