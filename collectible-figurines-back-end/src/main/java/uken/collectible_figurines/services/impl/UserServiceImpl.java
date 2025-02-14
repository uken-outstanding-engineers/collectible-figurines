package uken.collectible_figurines.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import uken.collectible_figurines.dto.ErrorUserDTO;
import uken.collectible_figurines.dto.UserDTO;
import uken.collectible_figurines.dto.UserUpdateAccountDTO;
import uken.collectible_figurines.model.Figurine;
import uken.collectible_figurines.model.User;
import uken.collectible_figurines.repository.UserRepository;
import uken.collectible_figurines.services.UserService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final BCryptPasswordEncoder passwordEncoder;

  private UserDTO convertToDTO(User user) {
    return new UserDTO(
      user.getId(),
      user.getUsername(),
      user.getEmail(),
      user.getPermission(),
      user.getLastLogin(),
      user.getAvatarUrl()
    );
  }

  @Override
  public User findByUsername(String username) {
    return userRepository.findByUsername(username);
  }
  public User findByEmail(String email) { return userRepository.findByEmail(email);}

  public List<UserDTO> getAllUsers() {
    List<User> users = userRepository.findAll(Sort.by(Sort.Direction.DESC, "lastLogin"));
    return users.stream()
      .map(user -> new UserDTO(
        user.getId(),
        user.getUsername(),
        null,
        user.getPermission(),
        user.getLastLogin(),
        user.getAvatarUrl()
      ))
      .collect(Collectors.toList());
  }

  public boolean checkPassword(String rawPassword, String encodedPassword) {

    //BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    //String pass = "user456";
    //String hashedPassword = encoder.encode(pass);

    //System.out.println("Hashed password: " + hashedPassword);

    return passwordEncoder.matches(rawPassword, encodedPassword);
  }

  public User register(User user) {
    String encodedPassword = passwordEncoder.encode(user.getPasswd());

    User newUser = new User();
    newUser.setUsername(user.getUsername());
    newUser.setEmail(user.getEmail());
    newUser.setPasswd(encodedPassword);
    newUser.setPermission("USER");

    return userRepository.save(newUser);
  }

  public void updateLastLogin(User user) {
    user.setLastLogin(LocalDateTime.now());
    userRepository.save(user);
  }

  public int getTotalUsers() {
    return (int) userRepository.count();
  }

  public int getActiveUsers() {
    LocalDateTime oneMonthAgo = LocalDateTime.now().minus(1, ChronoUnit.MONTHS);
    return userRepository.countUsersLoggedAfter(oneMonthAgo);
  }

  public User updateUserAvatar(Long userId, MultipartFile avatarFile) throws IOException {
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new RuntimeException("User not found"));

    if (avatarFile == null || avatarFile.isEmpty()) { // Obsługa pustego pliku
      if (user.getAvatarUrl() != null && !user.getAvatarUrl().isEmpty()) {
        File oldFile = new File("uploads/avatars-images/" + user.getAvatarUrl().replace("/api/images/avatars-images/", ""));
        if (oldFile.exists()) {
          oldFile.delete();
        }
      }
      user.setAvatarUrl(null);
      return userRepository.save(user);
    }

    if (user.getAvatarUrl() != null && !user.getAvatarUrl().isEmpty()) {
      String oldFileName = user.getAvatarUrl().replace("/api/images/avatars-images/", "");
      File oldFile = new File("uploads/avatars-images/" + oldFileName);
      if (oldFile.exists()) {
        oldFile.delete();
      }
    }

    Path directoryPath = Paths.get("uploads/avatars-images");
    if (!Files.exists(directoryPath)) {
      Files.createDirectories(directoryPath);
    }

    String fileName = UUID.randomUUID().toString() + "_" + avatarFile.getOriginalFilename();
    Path filePath = directoryPath.resolve(fileName);
    Files.write(filePath, avatarFile.getBytes());

    user.setAvatarUrl("/api/images/avatars-images/" + fileName);
    return userRepository.save(user);
  }

  public Object updateUserAccount(Long userId, UserUpdateAccountDTO userUpdate) {
    User user = userRepository.findById(userId)
      .orElse(null);

    if (user == null) {
      return Map.of("error", "NOT_EXIST");
    }

    if (userUpdate.getEmail() != null && !userUpdate.getEmail().isEmpty()) {
      user.setEmail(userUpdate.getEmail());
    }

    if (userUpdate.getNewPassword() != null && !userUpdate.getNewPassword().isEmpty()) {
      if (userUpdate.getCurrentPassword() == null || userUpdate.getCurrentPassword().isEmpty()) {
        return Map.of("error", "CURRENT_PASSWORD_REQUIRED");
      }

      if (!passwordEncoder.matches(userUpdate.getCurrentPassword(), user.getPasswd())) {
        return Map.of("error", "WRONG_PASSWORD");
      }

      user.setPasswd(passwordEncoder.encode(userUpdate.getNewPassword()));
    }

    User updatedUser = userRepository.save(user);
    return convertToDTO(updatedUser);
  }
}
