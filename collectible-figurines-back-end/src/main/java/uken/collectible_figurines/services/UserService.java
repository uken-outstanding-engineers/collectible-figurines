package uken.collectible_figurines.services;

import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.multipart.MultipartFile;
import uken.collectible_figurines.dto.UserDTO;
import uken.collectible_figurines.model.User;

import java.io.IOException;
import java.util.List;

public interface UserService {
  User findByUsername(String username);
  User findByEmail(String email);
  List<UserDTO> getAllUsers();
  boolean checkPassword(String rawPassword, String encodedPassword);
  User register(User user);
  void updateLastLogin(User user);
  int getTotalUsers();
  int getActiveUsers();
  User updateUserAvatar(Long userId, MultipartFile avatarFile) throws IOException;
  User updateEmail(Long userId, String newEmail);
}
