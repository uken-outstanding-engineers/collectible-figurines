package uken.collectible_figurines.model.dto;

public class ErrorUserDTO {
  private String error;

  public ErrorUserDTO(String error) {
    this.error = error;
  }

  public String getError() {
    return error;
  }

  public void setError(String error) {
    this.error = error;
  }
}
