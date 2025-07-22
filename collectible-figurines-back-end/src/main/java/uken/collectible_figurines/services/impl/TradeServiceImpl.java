package uken.collectible_figurines.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uken.collectible_figurines.model.Message;
import uken.collectible_figurines.model.Trade;
import uken.collectible_figurines.model.TradeItem;
import uken.collectible_figurines.model.User;
import uken.collectible_figurines.model.Figurine;
import uken.collectible_figurines.model.dto.MessageDTO;
import uken.collectible_figurines.repository.*;
import uken.collectible_figurines.services.TradeService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TradeServiceImpl implements TradeService {

  private final MessageRepository messageRepository;
  private final TradeRepository tradeRepository;
  private final TradeItemRepository tradeItemRepository;
  private final UserRepository userRepository;
  private final FigurineRepository figurineRepository;
  public TradeServiceImpl(MessageRepository messageRepository,
                          TradeRepository tradeRepository,
                          TradeItemRepository tradeItemRepository,
                          UserRepository userRepository,
                          FigurineRepository figurineRepository) {
    this.messageRepository = messageRepository;
    this.tradeRepository = tradeRepository;
    this.tradeItemRepository = tradeItemRepository;
    this.userRepository = userRepository;
    this.figurineRepository = figurineRepository;
  }

  public Message proposeTrade(MessageDTO messageDTO) {
    User sender = userRepository.findById(messageDTO.getSender().getId())
      .orElseThrow(() -> new RuntimeException("Sender not found"));
    User recipient = userRepository.findById(messageDTO.getRecipient().getId())
      .orElseThrow(() -> new RuntimeException("Recipient not found"));

    Trade trade = new Trade();
    trade.setInitiator(sender);
    trade.setRecipient(recipient);
    trade.setStatus("pending");

    for (Figurine figurineDTO : messageDTO.getTrade().getInitiatorFigures()) {
      Figurine f = figurineRepository.findById(figurineDTO.getId())
        .orElseThrow(() -> new RuntimeException("Figurine not found: " + figurineDTO.getId()));

      TradeItem item = new TradeItem();
      item.setFigurine(f);
      item.setOwner(sender);
      item.setTrade(trade);
      trade.getTradeItems().add(item);
    }

    for (Figurine figurineDTO : messageDTO.getTrade().getRecipientFigures()) {
      Figurine f = figurineRepository.findById(figurineDTO.getId())
        .orElseThrow(() -> new RuntimeException("Figurine not found: " + figurineDTO.getId()));

      TradeItem item = new TradeItem();
      item.setFigurine(f);
      item.setOwner(recipient);
      item.setTrade(trade);
      trade.getTradeItems().add(item);
    }

    tradeRepository.save(trade);

    Message message = new Message();
    message.setSender(sender);
    message.setRecipient(recipient);
    message.setDate(LocalDateTime.now());
    message.setSeen(false);
    message.setTrade(trade);
    message.setContent(messageDTO.getContent());

    return messageRepository.save(message);
  }
}
