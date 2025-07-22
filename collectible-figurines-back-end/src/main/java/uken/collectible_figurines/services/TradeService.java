package uken.collectible_figurines.services;

import uken.collectible_figurines.model.Message;
import uken.collectible_figurines.model.dto.MessageDTO;

public interface TradeService {

  Message proposeTrade(MessageDTO message);
}
