package uken.collectible_figurines.model.dto;

import java.time.LocalDateTime;

public class ActivityLogDTO {
  private Long id;
  private String action;
  private String name;
  private LocalDateTime date;
  private PublicUserDTO user;

  public ActivityLogDTO() {
  }

  public ActivityLogDTO(Long id, String action, String name, LocalDateTime date, PublicUserDTO userId) {
    this.id = id;
    this.action = action;
    this.date = date;
    this.name = name;
    this.user = userId;
  }

  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }
  public String getAction() {
    return action;
  }
  public void setAction(String action) {
    this.action = action;
  }
  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }
  public LocalDateTime getDate() {
    return date;
  }
  public void setDate(LocalDateTime date) {
    this.date = date;
  }
  public PublicUserDTO getUser() {
    return user;
  }
  public void setUser(PublicUserDTO user) {
    this.user = user;
  }
}
