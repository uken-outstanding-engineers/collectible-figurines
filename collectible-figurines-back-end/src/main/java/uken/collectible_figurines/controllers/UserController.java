package uken.collectible_figurines.controllers;

import org.springframework.web.bind.annotation.*;
import uken.collectible_figurines.model.User;
import uken.collectible_figurines.services.FigurineService;
import uken.collectible_figurines.services.UserService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {
  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @PostMapping("/login")
  public String loginUser(@RequestParam String username, @RequestParam String passwd) {
    User user = userService.findByUsername(username);

    if (user == null) {
      return "User not found";
    }

    boolean isPasswordValid = userService.checkPassword(passwd, user.getPasswd());
    if (!isPasswordValid) {
      return "Invalid password";
    }

    // Możemy dodać generowanie tokena JWT, jeśli potrzebujemy
    // String token = authenticationService.generateToken(user);

    return "Login successful";
  }
}
