package com.cartcraft.catalogue.application;

import com.cartcraft.catalogue.domain.Product;
import com.cartcraft.catalogue.infrastructure.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Page<Product> searchActiveProducts(
            Long categoryId,
            String query,
            int page,
            int size,
            ProductSort productSort
    ) {
        var pageable = PageRequest.of(page, size, productSort.sort());
        return productRepository.searchActiveProducts(categoryId, normalizeQuery(query), pageable);
    }

    public Product getActiveProduct(String slug) {
        return productRepository.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    private String normalizeQuery(String query) {
        return query == null ? "" : query.trim();
    }

    public enum ProductSort {
        NAME(Sort.by(Sort.Direction.ASC, "name")),
        PRICE_ASC(Sort.by(Sort.Direction.ASC, "price").and(Sort.by("id"))),
        PRICE_DESC(Sort.by(Sort.Direction.DESC, "price").and(Sort.by("id"))),
        NEWEST(Sort.by(Sort.Direction.DESC, "id"));

        private final Sort sort;

        ProductSort(Sort sort) {
            this.sort = sort;
        }

        public Sort sort() {
            return sort;
        }
    }
}
