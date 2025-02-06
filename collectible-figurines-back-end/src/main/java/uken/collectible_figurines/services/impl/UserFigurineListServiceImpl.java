package uken.collectible_figurines.services.impl;

import lombok.RequiredArgsConstructor;
import org.hibernate.type.ListType;
import org.springframework.stereotype.Service;
import uken.collectible_figurines.model.User;
import uken.collectible_figurines.model.UserFigurineList;
import uken.collectible_figurines.repository.FigurineRepository;
import uken.collectible_figurines.repository.UserFigurineListItemRepository;
import uken.collectible_figurines.repository.UserFigurineListRepository;
import uken.collectible_figurines.repository.UserRepository;
import uken.collectible_figurines.services.UserFigurineListService;

@Service
@RequiredArgsConstructor
public class UserFigurineListServiceImpl implements UserFigurineListService {
  private final UserFigurineListRepository listRepository;
  private final UserFigurineListItemRepository itemRepository;
  private final UserRepository userRepository;
  private final FigurineRepository figurineRepository;

  public UserFigurineList getOrCreatePredefinedList(Long userId, String type) {
    return listRepository.findByUserIdAndType(userId, type)
      .orElseGet(() -> {
        User user = userRepository.findById(userId).orElseThrow();
        UserFigurineList list = new UserFigurineList();
        list.setUser(user);
        list.setName(type);
        list.setType(type);
        return listRepository.save(list);
      });
  }



}
