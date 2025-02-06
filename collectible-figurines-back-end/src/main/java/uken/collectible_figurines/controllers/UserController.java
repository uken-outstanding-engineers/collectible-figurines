package uken.collectible_figurines.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import uken.collectible_figurines.dto.ErrorUserDTO;
import uken.collectible_figurines.model.User;
import uken.collectible_figurines.services.FigurineService;
import uken.collectible_figurines.services.UserService;
import uken.collectible_figurines.dto.UserDTO;

import java.util.List;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {
  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("/all")
  public List<UserDTO> getAllUsers() { return userService.getAllUsers(); }

  @PostMapping("/login")
  public UserDTO loginUser(@RequestParam String username, @RequestParam String passwd) {
    User user = userService.findByUsername(username);

    if(user != null && userService.checkPassword(passwd, user.getPasswd())) {
      userService.updateLastLogin(user);
      return new UserDTO(user.getId(), user.getUsername(), user.getEmail(), user.getPermission(), user.getLastLogin());
    }

    return null;
  }

  @PostMapping("/register")
  public Object registerUser(@RequestBody User user) {
    if (userService.findByUsername(user.getUsername()) != null) {
      return new ErrorUserDTO("USER_EXIST");
    }

    if (userService.findByEmail(user.getEmail()) != null) {
      return new ErrorUserDTO("EMAIL_EXIST");
    }

    User newUser = userService.register(user);

    if (newUser != null) {
      userService.updateLastLogin(newUser);
      return new UserDTO(newUser.getId(), newUser.getUsername(), newUser.getEmail(), newUser.getPermission(), newUser.getLastLogin());
    }

    return new ErrorUserDTO("ERROR");
  }

  @GetMapping("/total")
  public int getTotalUsers() {
    return userService.getTotalUsers();
  }

  @GetMapping("/active")
  public int getActiveUsers() {
    return userService.getActiveUsers();
  }
}
