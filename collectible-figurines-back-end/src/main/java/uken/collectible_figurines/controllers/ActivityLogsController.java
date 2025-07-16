package uken.collectible_figurines.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uken.collectible_figurines.model.dto.ActivityLogDTO;
import uken.collectible_figurines.services.ActivityLogsService;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/activity-logs")
public class ActivityLogsController {
  private final ActivityLogsService activityLogsService;

  public ActivityLogsController(ActivityLogsService activityLogsService) {
    this.activityLogsService = activityLogsService;
  }

  @GetMapping("/all")
  public List<ActivityLogDTO> getAllLogs() {
    return activityLogsService.getAllLogs();
  }
}
