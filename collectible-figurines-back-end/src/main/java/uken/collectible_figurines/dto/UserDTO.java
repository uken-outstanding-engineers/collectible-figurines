package uken.collectible_figurines.dto;

import java.time.LocalDateTime;

public class UserDTO {
  private Long id;
  private String username;
  private String email;
  private String permission;
  private LocalDateTime lastLogin;


  public UserDTO(Long id, String username, String email, String permission, LocalDateTime lastLogin) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.permission = permission;
    this.lastLogin = lastLogin;
  }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getPermission() { return permission; }
  public void setPermission(String permission) { this.permission = permission; }
  public LocalDateTime getLastLogin() { return lastLogin; }
  public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
}
