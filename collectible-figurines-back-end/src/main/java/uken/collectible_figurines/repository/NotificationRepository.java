package uken.collectible_figurines.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uken.collectible_figurines.model.Notification;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
  boolean existsBySenderIdAndRecipientIdAndType(Long senderId, Long recipientId, String type);
  Optional<Notification> findBySenderIdAndRecipientIdAndType(Long senderId, Long recipientId, String type);
  List<Notification> findAllByRecipientIdOrderByDateDesc(Long recipientId);
}
