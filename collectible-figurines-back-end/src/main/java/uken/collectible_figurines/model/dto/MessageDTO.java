package uken.collectible_figurines.model.dto;

import uken.collectible_figurines.model.Trade;

import java.time.LocalDateTime;

public class MessageDTO {
  private Long id;
  private PublicUserDTO sender;
  private PublicUserDTO recipient;
  private String content;
  private LocalDateTime date;
  private boolean seen;
  private TradeDTO trade;

  public MessageDTO(Long id, PublicUserDTO sender, PublicUserDTO recipient, String content, LocalDateTime date, boolean seen, TradeDTO trade) {
    this.id = id;
    this.sender = sender;
    this.recipient = recipient;
    this.content = content;
    this.date = date;
    this.seen = seen;
    this.trade = trade;
  }

  public Long getId() { return id; }
  public PublicUserDTO getSender() { return sender; }
  public PublicUserDTO getRecipient() { return recipient; }
  public String getContent() { return content; }
  public LocalDateTime getDate() { return date; }
  public boolean isSeen() { return seen; }
  public TradeDTO getTrade() { return trade; }
}

