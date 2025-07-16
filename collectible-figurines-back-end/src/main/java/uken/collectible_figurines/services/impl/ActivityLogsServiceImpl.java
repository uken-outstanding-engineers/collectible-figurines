package uken.collectible_figurines.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uken.collectible_figurines.model.ActivityLogs;
import uken.collectible_figurines.model.User;
import uken.collectible_figurines.model.dto.ActivityLogDTO;
import uken.collectible_figurines.model.dto.PublicUserDTO;
import uken.collectible_figurines.repository.ActivityLogsRepository;
import uken.collectible_figurines.repository.UserRepository;
import uken.collectible_figurines.services.ActivityLogsService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityLogsServiceImpl implements ActivityLogsService {

  private final ActivityLogsRepository activityLogsRepository;
  private final UserRepository userRepository;

  public List<ActivityLogDTO> getAllLogs() {
    return activityLogsRepository.findAllByOrderByDateDesc().stream()
      .map(log -> new ActivityLogDTO(
        log.getId(),
        log.getAction(),
        log.getName(),
        log.getDate(),
        new PublicUserDTO(log.getUser())
      ))
      .collect(Collectors.toList());
  }

  public void logAction(Long userId, String action, String name) {
    User user = userRepository.findById(userId).orElseThrow(() ->
      new RuntimeException("User not found"));

    ActivityLogs log = new ActivityLogs();
    log.setUser(user);
    log.setAction(action);
    log.setName(name);
    log.setDate(LocalDateTime.now());

    activityLogsRepository.save(log);
  }


}
