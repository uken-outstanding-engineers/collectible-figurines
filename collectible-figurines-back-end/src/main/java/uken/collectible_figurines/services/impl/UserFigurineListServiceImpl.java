package uken.collectible_figurines.services.impl;

import lombok.RequiredArgsConstructor;
import org.hibernate.type.ListType;
import org.springframework.stereotype.Service;
import uken.collectible_figurines.model.Figurine;
import uken.collectible_figurines.model.User;
import uken.collectible_figurines.model.UserFigurineList;
import uken.collectible_figurines.model.UserFigurineListItem;
import uken.collectible_figurines.repository.FigurineRepository;
import uken.collectible_figurines.repository.UserFigurineListItemRepository;
import uken.collectible_figurines.repository.UserFigurineListRepository;
import uken.collectible_figurines.repository.UserRepository;
import uken.collectible_figurines.services.UserFigurineListService;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserFigurineListServiceImpl implements UserFigurineListService {
  private final UserFigurineListRepository listRepository;
  private final UserFigurineListItemRepository itemRepository;
  private final UserRepository userRepository;
  private final FigurineRepository figurineRepository;
  @Override
  public UserFigurineList getOrCreatePredefinedList(Long userId, String name) {
    String type;

    if ("Liked".equalsIgnoreCase(name) || "Wanted".equalsIgnoreCase(name)) {
      type = name.toUpperCase();
    } else {
      type = "CUSTOM";
    }

    return listRepository.findByUserIdAndType(userId, type)
      .orElseGet(() -> {
        User user = userRepository.findById(userId).orElseThrow();
        UserFigurineList list = new UserFigurineList();
        list.setUser(user);
        list.setName(name);
        list.setType(type);
        return listRepository.save(list);
      });
  }

  public boolean toggleFigurineInList(Long userId, Long figurineId, String listName) {
    User user = userRepository.findById(userId).orElseThrow();

    UserFigurineList userList = listRepository.findByUserIdAndName(userId, listName)
      .orElseThrow(() -> new IllegalArgumentException("List not found"));

    Optional<UserFigurineListItem> existingItem = itemRepository.findByListIdAndFigurineId(userList.getId(), figurineId);

    if (existingItem.isPresent()) {
      itemRepository.delete(existingItem.get());
      return false;
    } else {
      Figurine figurine = figurineRepository.findById(figurineId).orElseThrow();
      UserFigurineListItem newItem = new UserFigurineListItem();
      newItem.setList(userList);
      newItem.setFigurine(figurine);
      newItem.setDate(LocalDateTime.now());

      itemRepository.save(newItem);
      return true;
    }
  }
}
