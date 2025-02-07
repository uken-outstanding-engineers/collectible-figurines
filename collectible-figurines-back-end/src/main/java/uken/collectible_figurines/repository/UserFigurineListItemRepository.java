package uken.collectible_figurines.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uken.collectible_figurines.model.UserFigurineListItem;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFigurineListItemRepository extends JpaRepository<UserFigurineListItem, Long> {
  List<UserFigurineListItem> findByListId(Long listId);
  Optional<UserFigurineListItem> findByListIdAndFigurineId(Long listId, Long figurineId);
}

