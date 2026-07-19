package com.cartcraft.cart.infrastructure;

import com.cartcraft.cart.domain.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findAllByCartIdOrderByIdAsc(UUID cartId);

    Optional<CartItem> findByCartIdAndProductId(UUID cartId, Long productId);
}
