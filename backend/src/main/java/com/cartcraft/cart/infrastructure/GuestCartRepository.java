package com.cartcraft.cart.infrastructure;

import com.cartcraft.cart.domain.GuestCart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface GuestCartRepository extends JpaRepository<GuestCart, UUID> {
}
