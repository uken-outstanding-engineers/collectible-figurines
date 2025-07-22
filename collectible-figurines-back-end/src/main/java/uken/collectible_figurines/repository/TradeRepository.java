package uken.collectible_figurines.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uken.collectible_figurines.model.Trade;

@Repository
public interface TradeRepository extends JpaRepository<Trade, Long> {
}
