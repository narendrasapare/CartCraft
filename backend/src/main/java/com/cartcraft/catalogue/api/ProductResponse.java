package com.cartcraft.catalogue.api;

import com.cartcraft.catalogue.domain.Product;

import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        String name,
        String slug,
        String description,
        BigDecimal price,
        String imageUrl,
        Long categoryId
) {

    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                product.getPrice(),
                product.getImageUrl(),
                product.getCategoryId()
        );
    }
}