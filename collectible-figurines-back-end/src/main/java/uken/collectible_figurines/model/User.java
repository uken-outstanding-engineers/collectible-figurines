package uken.collectible_figurines.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "email", nullable = false, unique = true)
  private String email;

  @Column(name = "username", nullable = false, unique = true)
  private String username;

  @Column(name = "passwd", nullable = false)
  private String passwd;

  @Column(name = "permission", nullable = false)
  private String permission;

  @Column(name = "last_login")
  private LocalDateTime lastLogin;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }
  public String getPasswd() { return passwd; }
  public void setPasswd(String passwd) { this.passwd = passwd; }
  public String getPermission() { return permission; }
  public void setPermission(String permission) { this.permission = permission; }
  public LocalDateTime getLastLogin() { return lastLogin; }
  public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
}
