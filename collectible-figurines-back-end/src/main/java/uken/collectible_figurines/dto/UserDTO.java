package uken.collectible_figurines.dto;

import uken.collectible_figurines.model.User;

import java.time.LocalDateTime;

public class UserDTO {
  private Long id;
  private String username;
  private String email;
  private String permission;
  private LocalDateTime lastLogin;
  private String avatarUrl;

  public UserDTO(Long id, String username, String email, String permission, LocalDateTime lastLogin, String avatarUrl) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.permission = permission;
    this.lastLogin = lastLogin;
    this.avatarUrl = avatarUrl;
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

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPermission() {
    return permission;
  }

  public void setPermission(String permission) {
    this.permission = permission;
  }

  public LocalDateTime getLastLogin() {
    return lastLogin;
  }

  public void setLastLogin(LocalDateTime lastLogin) {
    this.lastLogin = lastLogin;
  }

  public String getAvatarUrl() {
    return avatarUrl;
  }

  public void setAvatarUrl(String avatarUrl) {
    this.avatarUrl = avatarUrl;
  }
}
