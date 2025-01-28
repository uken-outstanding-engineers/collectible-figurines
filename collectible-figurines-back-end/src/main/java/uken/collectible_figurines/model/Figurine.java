package uken.collectible_figurines.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "figurines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Figurine {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name")
  private String name;

  @Column(name = "series")
  private String series;

  @Column(name = "image_url")
  private String imageUrl;

  @Column(name = "hover_image_url")
  private String hoverImageUrl;

  @Column(name = "fandom_id")
  private Integer fandomId;

  @Column(name = "chase")
  private Boolean chase;

  @Column(name = "glow_in_dark")
  private Boolean glowInDark;

  @Column(name = "flocked")
  private Boolean flocked;

  @Column(name = "exclusive")
  private Boolean exclusive;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getSeries() {
    return series;
  }

  public void setSeries(String series) {
    this.series = series;
  }

  public String getImageUrl() {
    return imageUrl;
  }

  public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
  }

  public String getHoverImageUrl() {
    return hoverImageUrl;
  }

  public void setHoverImageUrl(String hoverImageUrl) {
    this.hoverImageUrl = hoverImageUrl;
  }

  public Integer getFandomId() {
    return fandomId;
  }

  public void setFandomId(Integer fandomId) {
    this.fandomId = fandomId;
  }

  public Boolean getChase() {
    return chase;
  }

  public void setChase(Boolean chase) {
    this.chase = chase;
  }

  public Boolean getGlowInDark() {
    return glowInDark;
  }

  public void setGlowInDark(Boolean glowInDark) {
    this.glowInDark = glowInDark;
  }

  public Boolean getFlocked() {
    return flocked;
  }

  public void setFlocked(Boolean flocked) {
    this.flocked = flocked;
  }

  public Boolean getExclusive() {
    return exclusive;
  }

  public void setExclusive(Boolean exclusive) {
    this.exclusive = exclusive;
  }
}
