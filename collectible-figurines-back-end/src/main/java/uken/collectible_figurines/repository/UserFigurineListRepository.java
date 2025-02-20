package uken.collectible_figurines.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uken.collectible_figurines.model.UserFigurineList;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFigurineListRepository extends JpaRepository<UserFigurineList, Long> {
  List<UserFigurineList> findByUserId(Long userId);
  Optional<UserFigurineList> findByUserIdAndType(Long userId, String type);
  Optional<UserFigurineList> findByUserIdAndName(Long userId, String name);
}
