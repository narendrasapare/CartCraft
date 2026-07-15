package com.cartcraft.catalogue.application;

import com.cartcraft.catalogue.domain.Product;
import com.cartcraft.catalogue.infrastructure.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getActiveProducts() {
        return productRepository.findAllByActiveTrueOrderByNameAsc();
    }
}