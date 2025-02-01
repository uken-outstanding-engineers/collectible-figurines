package uken.collectible_figurines.dto;

public class UserDTO {
  private Long id;
  private String username;
  private String email;
  private String permission;


  public UserDTO(Long id, String username, String email, String permission) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.permission = permission;
  }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getPermission() { return permission; }
  public void setPermission(String permission) { this.permission = permission; }
}
