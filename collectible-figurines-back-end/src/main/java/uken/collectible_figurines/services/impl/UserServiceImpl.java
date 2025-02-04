package uken.collectible_figurines.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import uken.collectible_figurines.dto.ErrorUserDTO;
import uken.collectible_figurines.dto.UserDTO;
import uken.collectible_figurines.model.User;
import uken.collectible_figurines.repository.UserRepository;
import uken.collectible_figurines.services.UserService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final BCryptPasswordEncoder passwordEncoder;

  @Override
  public User findByUsername(String username) {
    return userRepository.findByUsername(username);
  }
  public User findByEmail(String email) { return userRepository.findByEmail(email);}

  public List<UserDTO> getAllUsers() {
    List<User> users = userRepository.findAll();
    return users.stream()
      .map(user -> new UserDTO(
        user.getId(),
        user.getUsername(),
        null,
        user.getPermission(),
        user.getLastLogin()
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
}
