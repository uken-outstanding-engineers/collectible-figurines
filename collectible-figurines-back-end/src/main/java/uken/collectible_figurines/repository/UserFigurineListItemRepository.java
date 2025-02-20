package uken.collectible_figurines.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uken.collectible_figurines.model.UserFigurineListItem;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFigurineListItemRepository extends JpaRepository<UserFigurineListItem, Long> {
  List<UserFigurineListItem> findByListId(Long listId);
  Optional<UserFigurineListItem> findByListIdAndFigurineId(Long listId, Long figurineId);
  void deleteByFigurineId(Long figurineId);

  @Query("SELECT COUNT(u) FROM UserFigurineListItem u WHERE u.figurine.id = :figurineId AND u.list.type = :listType")
  long countByTypeForFigurine(@Param("figurineId") Long figurineId, @Param("listType") String listType);

  @Query("SELECT uf.type, COUNT(ufi) "
    + "FROM UserFigurineListItem ufi "
    + "JOIN ufi.list uf "
    + "WHERE uf.user.id = :userId "
    + "GROUP BY uf.type")
  List<Object[]> getUserFigurineStatsByType(Long userId);

}

