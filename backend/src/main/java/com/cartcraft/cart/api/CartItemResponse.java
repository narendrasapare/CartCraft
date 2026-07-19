package com.cartcraft.cart.api;

import com.cartcraft.cart.domain.CartItem;

import java.math.BigDecimal;

public record CartItemResponse(
        Long productId,
        String name,
        String slug,
        BigDecimal unitPrice,
        String imageUrl,
        int quantity,
        BigDecimal lineTotal
) {
    public static CartItemResponse from(CartItem item) {
        var product = item.getProduct();
        return new CartItemResponse(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getPrice(),
                product.getImageUrl(),
                item.getQuantity(),
                product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
        );
    }
}
