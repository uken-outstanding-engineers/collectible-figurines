package uken.collectible_figurines.services;

import uken.collectible_figurines.model.dto.ActivityLogDTO;

import java.util.List;

public interface ActivityLogsService {
  List<ActivityLogDTO> getAllLogs();
  void logAction(Long userId, String action, String name);
}
