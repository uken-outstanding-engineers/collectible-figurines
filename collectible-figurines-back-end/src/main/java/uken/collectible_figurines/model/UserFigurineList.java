package uken.collectible_figurines.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.type.ListType;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user_figurine_lists")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserFigurineList {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(name = "name")
  private String name;

  @Column(name = "type")
  private String type;

  @OneToMany(mappedBy = "list", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<UserFigurineListItem> figurines = new ArrayList<>();

  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }
  public User getUser() {
    return user;
  }
  public void setUser(User user) {
    this.user = user;
  }
  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }
  public String getType() { return type; }
  public void setType(String type) { this.type = type; }
  public List<UserFigurineListItem> getFigurines() {
    return figurines;
  }
  public void setFigurines(List<UserFigurineListItem> figurines) {
    this.figurines = figurines;
  }
}


