package com.cartcraft.catalogue.api;

import org.springframework.data.domain.Page;

import java.util.List;

public record ProductPageResponse(
        List<ProductResponse> items,
        int page,
        int pageSize,
        long totalItems,
        int totalPages
) {
    public static ProductPageResponse from(Page<com.cartcraft.catalogue.domain.Product> products) {
        return new ProductPageResponse(
                products.getContent().stream().map(ProductResponse::from).toList(),
                products.getNumber(),
                products.getSize(),
                products.getTotalElements(),
                products.getTotalPages()
        );
    }
}
