package uken.collectible_figurines.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uken.collectible_figurines.model.*;
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
  private final UserRepository userRepository;
  private final FigurineRepository figurineRepository;
  private final NotificationRepository notificationRepository;
  public TradeServiceImpl(MessageRepository messageRepository,
                          TradeRepository tradeRepository,
                          UserRepository userRepository,
                          FigurineRepository figurineRepository,
                          NotificationRepository notificationRepository) {
    this.messageRepository = messageRepository;
    this.tradeRepository = tradeRepository;
    this.userRepository = userRepository;
    this.figurineRepository = figurineRepository;
    this.notificationRepository = notificationRepository;
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

    Notification notification = new Notification();
    notification.setSender(sender);
    notification.setRecipient(recipient);
    notification.setType("TRADE_REQUEST");
    notification.setDate(LocalDateTime.now());

    notificationRepository.save(notification);

    return messageRepository.save(message);
  }

  public void acceptTrade(Long tradeId) {
    Trade trade = tradeRepository.findById(tradeId)
      .orElseThrow(() -> new RuntimeException("Trade not found"));

    trade.setStatus("ACCEPTED");
    tradeRepository.save(trade);

    Notification notification = new Notification();
    notification.setSender(trade.getRecipient());
    notification.setRecipient(trade.getInitiator());
    notification.setType("TRADE_ACCEPTED");
    notification.setDate(LocalDateTime.now());

    notificationRepository.save(notification);
  }

  public void cancelTrade(Long tradeId) {
    Trade trade = tradeRepository.findById(tradeId)
      .orElseThrow(() -> new RuntimeException("Trade not found"));

    trade.setStatus("CANCELED");
    tradeRepository.save(trade);
  }

}
