package com.cartcraft.cart.api;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class CartControllerIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void createsUpdatesReadsAndRemovesCartItems() throws Exception {
        String createResponse = mockMvc.perform(post("/api/carts"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.items.length()").value(0))
                .andReturn()
                .getResponse()
                .getContentAsString();
        String cartId = JsonPath.read(createResponse, "$.id");

        mockMvc.perform(put("/api/carts/{cartId}/items/{productId}", cartId, 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"quantity\":2}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalQuantity").value(2))
                .andExpect(jsonPath("$.subtotal").value(5998.00))
                .andExpect(jsonPath("$.items[0].name").value("Wireless Headphones"))
                .andExpect(jsonPath("$.items[0].quantity").value(2));

        mockMvc.perform(get("/api/carts/{cartId}", cartId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalQuantity").value(2));

        mockMvc.perform(delete("/api/carts/{cartId}/items/{productId}", cartId, 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items.length()").value(0))
                .andExpect(jsonPath("$.subtotal").value(0));
    }

    @Test
    void rejectsInvalidQuantity() throws Exception {
        String createResponse = mockMvc.perform(post("/api/carts"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        String cartId = JsonPath.read(createResponse, "$.id");

        mockMvc.perform(put("/api/carts/{cartId}/items/{productId}", cartId, 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"quantity\":0}"))
                .andExpect(status().isBadRequest());
    }
}
