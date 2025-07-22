package uken.collectible_figurines.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uken.collectible_figurines.model.Message;
import uken.collectible_figurines.model.dto.MessageDTO;
import uken.collectible_figurines.services.MessageService;
import uken.collectible_figurines.services.TradeService;
import uken.collectible_figurines.mapper.MessageMapper;

@RestController
@RequestMapping("/api/trades")
public class TradeController {
  private final TradeService tradeService;
  private final MessageMapper messageMapper;

  public TradeController(TradeService tradeService, MessageMapper messageMapper) {
    this.tradeService = tradeService;
    this.messageMapper = messageMapper;
  }

  @PostMapping("/propose")
  public MessageDTO proposeTrade(@RequestBody MessageDTO messageDTO) {
    Message savedMessage = tradeService.proposeTrade(messageDTO);
    return messageMapper.toMessageDTO(savedMessage);
  }



}
