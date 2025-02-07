package uken.collectible_figurines.services;

import org.hibernate.type.ListType;
import uken.collectible_figurines.model.UserFigurineList;

public interface UserFigurineListService {
  UserFigurineList getOrCreatePredefinedList(Long userId, String type);
  boolean toggleFigurineInList(Long userId, Long figurineId, String listName);
}
