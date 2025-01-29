package uken.collectible_figurines.services;

import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import uken.collectible_figurines.model.User;

public interface UserService {
  User findByUsername(String username);
  boolean checkPassword(String rawPassword, String encodedPassword);
}
