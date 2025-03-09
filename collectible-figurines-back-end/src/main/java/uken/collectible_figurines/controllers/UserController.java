package uken.collectible_figurines.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import uken.collectible_figurines.model.dto.ErrorUserDTO;
import uken.collectible_figurines.model.dto.TokenResponse;
import uken.collectible_figurines.model.dto.UserUpdateAccountDTO;
import uken.collectible_figurines.model.User;
import uken.collectible_figurines.response.ApiResponse;
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
  public TokenResponse loginUser(@RequestParam String username, @RequestParam String passwd) {
    User user = userService.findByUsernameIgnoreCase(username);

    if(user != null && userService.checkPassword(passwd, user.getPasswd())) {
      userService.updateLastLogin(user);
      String token = jwtService.generateToken(user.getId(),user.getUsername(), user.getEmail(), user.getPermission(), user.getAvatarUrl());
      return new TokenResponse(token);
    }

    return null;
  }

  @PostMapping("/register")
  public Object registerUser(@RequestBody User user) {
    if (userService.findByUsernameIgnoreCase(user.getUsername()) != null) {
      return new ErrorUserDTO("USER_EXIST");
    }

    if (userService.findByEmailIgnoreCase(user.getEmail()) != null) {
      return new ErrorUserDTO("EMAIL_EXIST");
    }

    User newUser = userService.register(user);

    if (newUser != null) {
      userService.updateLastLogin(newUser);

      String token = jwtService.generateToken(newUser.getId(), newUser.getUsername(),
        newUser.getEmail(), newUser.getPermission(),
        newUser.getAvatarUrl());

      return new TokenResponse(token);
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
  public TokenResponse uploadAvatar(@PathVariable Long id, @RequestParam("avatar") MultipartFile avatarFile) throws IOException {
    User updatedUser = userService.updateUserAvatar(id, avatarFile);
    String token = jwtService.generateToken(
      updatedUser.getId(),
      updatedUser.getUsername(),
      updatedUser.getEmail(),
      updatedUser.getPermission(),
      updatedUser.getAvatarUrl()
    );
    return new TokenResponse(token);
  }

  @PutMapping("/{id}/update-account")
  public ApiResponse<TokenResponse> updateUserAccount(
    @PathVariable Long id,
    @RequestBody UserUpdateAccountDTO userUpdate) {

    Object result = userService.updateUserAccount(id, userUpdate);

    if (result instanceof Map) {
      Map<String, String> errorMap = (Map<String, String>) result;
      return new ApiResponse<>(false, errorMap.get("error"), null);
    }

    if (result instanceof UserDTO userDTO) {
      String token = jwtService.generateToken(
        userDTO.getId(),
        userDTO.getUsername(),
        userDTO.getEmail(),
        userDTO.getPermission(),
        userDTO.getAvatarUrl()
      );
      return new ApiResponse<>(true, "SUCCESS", new TokenResponse(token));
    }

    return new ApiResponse<>(false, "ERROR", null);
  }

  @GetMapping("/{userId}/stats")
  public Map<String, Long> getUserFigurineStats(@PathVariable Long userId) {
    return userService.getUserFigurineStats(userId);
  }
}

