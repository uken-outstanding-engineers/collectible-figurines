package uken.collectible_figurines.model.dto;

import uken.collectible_figurines.model.User;

public class PublicUserDTO {
  private Long id;
  private String username;
  private String avatarUrl;

  public PublicUserDTO(Long id, String username, String avatarUrl) {
    this.id = id;
    this.username = username;
    this.avatarUrl = avatarUrl;
  }

  public PublicUserDTO(User user) {
    if (user != null) {
      this.id = user.getId();
      this.username = user.getUsername();
      this.avatarUrl = user.getAvatarUrl();
    }
  }

  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }
  public String getUsername() {
    return username;
  }
  public void setUsername(String username) {
    this.username = username;
  }
  public String getAvatarUrl() {
    return avatarUrl;
  }
  public void setAvatarUrl(String avatarUrl) {
    this.avatarUrl = avatarUrl;
  }
}
