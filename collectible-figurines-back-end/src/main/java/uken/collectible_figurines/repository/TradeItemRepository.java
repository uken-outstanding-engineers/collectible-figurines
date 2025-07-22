package uken.collectible_figurines.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uken.collectible_figurines.model.TradeItem;

public interface TradeItemRepository extends JpaRepository<TradeItem, Long> {
}
