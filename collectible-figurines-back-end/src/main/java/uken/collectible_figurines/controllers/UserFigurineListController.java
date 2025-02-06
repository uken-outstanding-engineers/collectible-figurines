package uken.collectible_figurines.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uken.collectible_figurines.model.Figurine;
import uken.collectible_figurines.model.UserFigurineList;
import uken.collectible_figurines.services.UserFigurineListService;
import uken.collectible_figurines.model.UserFigurineListItem;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/figurine-lists")
public class UserFigurineListController {
  private final UserFigurineListService listService;

    public UserFigurineListController(UserFigurineListService listService) { this.listService = listService; }

    @GetMapping("/figurines/{userId}")
    public ResponseEntity<Map<String, List<Figurine>>> getLikedAndWantedFigurines(@PathVariable Long userId) {
      UserFigurineList likedList = listService.getOrCreatePredefinedList(userId, "LIKED");
      List<Figurine> likedFigurines = likedList.getFigurines()
        .stream()
        .map(UserFigurineListItem::getFigurine)
        .collect(Collectors.toList());

      UserFigurineList wantedList = listService.getOrCreatePredefinedList(userId, "WANTED");
      List<Figurine> wantedFigurines = wantedList.getFigurines()
        .stream()
        .map(UserFigurineListItem::getFigurine)
        .collect(Collectors.toList());

      Map<String, List<Figurine>> response = new HashMap<>();
      response.put("liked", likedFigurines);
      response.put("wanted", wantedFigurines);

      return ResponseEntity.ok(response);
    }

}
