package uken.collectible_figurines.model.dto;

import uken.collectible_figurines.model.Figurine;

import java.util.List;

public class TradeDTO {
  private Long id;
  private String status;
  private List<Figurine> initiatorFigures;
  private List<Figurine> recipientFigures;

  public TradeDTO() {
  }

  public TradeDTO(Long id, String status, List<Figurine> initiatorFigures, List<Figurine> recipientFigures) {
    this.id = id;
    this.status = status;
    this.initiatorFigures = initiatorFigures;
    this.recipientFigures = recipientFigures;
  }

  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }
  public String getStatus() {
    return status;
  }
  public void setStatus(String status) {
    this.status = status;
  }
  public List<Figurine> getInitiatorFigures() {
    return initiatorFigures;
  }
  public void setInitiatorFigures(List<Figurine> initiatorFigures) {
    this.initiatorFigures = initiatorFigures;
  }
  public List<Figurine> getRecipientFigures() {
    return recipientFigures;
  }
  public void setRecipientFigures(List<Figurine> recipientFigures) {
    this.recipientFigures = recipientFigures;
  }
}
