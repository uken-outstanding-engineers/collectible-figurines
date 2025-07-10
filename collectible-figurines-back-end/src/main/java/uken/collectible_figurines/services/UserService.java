package uken.collectible_figurines.services;

import org.springframework.web.multipart.MultipartFile;
import uken.collectible_figurines.model.dto.UserDTO;
import uken.collectible_figurines.model.dto.UserUpdateAccountDTO;
import uken.collectible_figurines.model.User;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface UserService {
  User findByUsername(String username);
  User findByEmail(String email);
  User findByUsernameIgnoreCase(String username);
  User findByEmailIgnoreCase(String email);
  List<UserDTO> getAllUsers();
  User findByHashedShareIdOrThrow(String shareId);
  boolean checkPassword(String rawPassword, String encodedPassword);
  User register(User user);
  void updateLastLogin(User user);
  int getTotalUsers();
  int getActiveUsers();
  User updateUserAvatar(Long userId, MultipartFile avatarFile) throws IOException;
  Object updateUserAccount(Long userId, UserUpdateAccountDTO userUpdate);
  Map<String, Long> getUserFigurineStats(Long userId);
}
