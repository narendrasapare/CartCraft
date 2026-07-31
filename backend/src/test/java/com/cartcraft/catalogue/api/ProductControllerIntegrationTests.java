package com.cartcraft.catalogue.api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void returnsPagedActiveProductsOrderedByName() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items.length()").value(8))
                .andExpect(jsonPath("$.items[0].name").value("Canvas Sling Bag"))
                .andExpect(jsonPath("$.items[7].name").value("Wireless Mouse"))
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.pageSize").value(12))
                .andExpect(jsonPath("$.totalItems").value(8))
                .andExpect(jsonPath("$.totalPages").value(1));
    }

    @Test
    void searchesFiltersAndSortsProducts() throws Exception {
        mockMvc.perform(get("/api/products")
                        .param("categoryId", "1")
                        .param("query", "headphones")
                        .param("sort", "PRICE_DESC"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items.length()").value(1))
                .andExpect(jsonPath("$.items[0].slug").value("wireless-headphones"))
                .andExpect(jsonPath("$.totalItems").value(1));
    }

    @Test
    void returnsProductDetailsBySlug() throws Exception {
        mockMvc.perform(get("/api/products/mechanical-keyboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Mechanical Keyboard"))
                .andExpect(jsonPath("$.slug").value("mechanical-keyboard"));
    }

    @Test
    void rejectsInvalidPageSize() throws Exception {
        mockMvc.perform(get("/api/products").param("size", "100"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void returnsNotFoundForUnknownProduct() throws Exception {
        mockMvc.perform(get("/api/products/not-a-product"))
                .andExpect(status().isNotFound());
    }
}
