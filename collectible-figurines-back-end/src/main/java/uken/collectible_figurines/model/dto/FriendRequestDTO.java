package uken.collectible_figurines.model.dto;

public class FriendRequestDTO {
  private Long senderId;
  private Long recipientId;

  public Long getSenderId() {
    return senderId;
  }
  public void setSenderId(Long senderId) {
    this.senderId = senderId;
  }
  public Long getRecipientId() {
    return recipientId;
  }
  public void setRecipientId(Long recipientId) {
    this.recipientId = recipientId;
  }
}
