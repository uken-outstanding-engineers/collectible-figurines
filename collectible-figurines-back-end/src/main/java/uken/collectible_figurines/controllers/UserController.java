package uken.collectible_figurines.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import uken.collectible_figurines.model.dto.ErrorUserDTO;
import uken.collectible_figurines.model.dto.LoginResponse;
import uken.collectible_figurines.model.dto.UserUpdateAccountDTO;
import uken.collectible_figurines.model.User;
import uken.collectible_figurines.security.JwtService;
import uken.collectible_figurines.services.UserService;
import uken.collectible_figurines.model.dto.UserDTO;
import java.util.Map;
import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {
  private final UserService userService;
  private final JwtService jwtService;

  @Autowired
  public UserController(UserService userService, JwtService jwtService) {
    this.userService = userService;
    this.jwtService = jwtService;
  }

  @GetMapping("/all")
  public List<UserDTO> getAllUsers() { return userService.getAllUsers(); }

  @PostMapping("/login")
  public LoginResponse loginUser(@RequestParam String username, @RequestParam String passwd) {
    User user = userService.findByUsername(username.trim().toLowerCase());

    if(user != null && userService.checkPassword(passwd, user.getPasswd())) {
      userService.updateLastLogin(user);
      String token = jwtService.generateToken(user.getId(),user.getUsername(), user.getEmail(), user.getPermission());
      return new LoginResponse(token);
      //return new UserDTO(user.getId(), user.getUsername(), user.getEmail(), user.getPermission(), user.getLastLogin(), user.getAvatarUrl());
    }

    return null;
  }

  @PostMapping("/register")
  public Object registerUser(@RequestBody User user) {
    if (userService.findByUsername(user.getUsername().toLowerCase()) != null) {
      return new ErrorUserDTO("USER_EXIST");
    }

    if (userService.findByEmail(user.getEmail().toLowerCase()) != null) {
      return new ErrorUserDTO("EMAIL_EXIST");
    }

    User newUser = userService.register(user);

    if (newUser != null) {
      userService.updateLastLogin(newUser);
      return new UserDTO(newUser.getId(), newUser.getUsername(), newUser.getEmail(), newUser.getPermission(), newUser.getLastLogin(), newUser.getAvatarUrl());
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

  @PutMapping("/{id}/avatar")
  public User uploadAvatar(@PathVariable Long id, @RequestParam("avatar") MultipartFile avatarFile) throws IOException {
    return userService.updateUserAvatar(id, avatarFile);
  }

  @PutMapping("/{id}/update-account")
  public Object updateUserAccount(@PathVariable Long id, @RequestBody UserUpdateAccountDTO userUpdate) {
    return userService.updateUserAccount(id, userUpdate);
  }

  @GetMapping("/{userId}/stats")
  public Map<String, Long> getUserFigurineStats(@PathVariable Long userId) {
    return userService.getUserFigurineStats(userId);
  }
}

