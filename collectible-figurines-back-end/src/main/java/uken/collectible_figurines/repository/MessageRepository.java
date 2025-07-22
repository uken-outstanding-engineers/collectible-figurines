package uken.collectible_figurines.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import uken.collectible_figurines.model.Message;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

  @Query("SELECT m FROM Message m " +
    "WHERE (m.sender.id = :userId1 AND m.recipient.id = :userId2) " +
    "   OR (m.sender.id = :userId2 AND m.recipient.id = :userId1) " +
    "ORDER BY m.date ASC")
  List<Message> findConversationBetweenUsers(@Param("userId1") Long userId1,
                                             @Param("userId2") Long userId2);

  List<Message> findAllBySender_IdOrRecipient_Id(Long senderId, Long recipientId);


}

