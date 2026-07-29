package com.cartcraft.catalogue.infrastructure;

import com.cartcraft.catalogue.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("""
            select product from Product product
            where product.active = true
              and (:categoryId is null or product.categoryId = :categoryId)
              and (:query = '' or lower(product.name) like lower(concat('%', :query, '%'))
                   or lower(product.description) like lower(concat('%', :query, '%')))
            """)
    Page<Product> searchActiveProducts(Long categoryId, String query, Pageable pageable);

    Optional<Product> findByIdAndActiveTrue(Long id);

    Optional<Product> findBySlugAndActiveTrue(String slug);
}
