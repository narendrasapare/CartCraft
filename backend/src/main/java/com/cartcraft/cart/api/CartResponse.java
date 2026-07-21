package com.cartcraft.cart.api;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record CartResponse(
        UUID id,
        List<CartItemResponse> items,
        int totalQuantity,
        BigDecimal subtotal
) {
    public static CartResponse from(UUID id, List<CartItemResponse> items) {
        int totalQuantity = items.stream().mapToInt(CartItemResponse::quantity).sum();
        BigDecimal subtotal = items.stream()
                .map(CartItemResponse::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new CartResponse(id, items, totalQuantity, subtotal);
    }
}
