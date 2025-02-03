package uken.collectible_figurines.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import uken.collectible_figurines.model.User;
import uken.collectible_figurines.services.FigurineService;
import uken.collectible_figurines.services.UserService;
import uken.collectible_figurines.dto.UserDTO;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {
  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @PostMapping("/login")
  public UserDTO loginUser(@RequestParam String username, @RequestParam String passwd) {
    User user = userService.findByUsername(username);

    if (user == null) {
      return null;
    }

    boolean isPasswordValid = userService.checkPassword(passwd, user.getPasswd());
    if (!isPasswordValid) {
      return null;
    }

    return new UserDTO(user.getId(), user.getUsername(), user.getEmail(), user.getPermission());
  }
}
