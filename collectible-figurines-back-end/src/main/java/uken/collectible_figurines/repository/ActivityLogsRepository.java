package uken.collectible_figurines.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uken.collectible_figurines.model.ActivityLogs;

import java.util.List;

@Repository
public interface ActivityLogsRepository extends JpaRepository<ActivityLogs, Long> {
  List<ActivityLogs> findAllByOrderByDateDesc();
}
