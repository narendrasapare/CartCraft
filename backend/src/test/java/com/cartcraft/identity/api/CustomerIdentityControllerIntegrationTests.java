package com.cartcraft.identity.api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import jakarta.servlet.http.Cookie;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CustomerIdentityControllerIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void registersLogsInReadsCurrentCustomerAndLogsOut() throws Exception {
        String email = "customer-" + UUID.randomUUID() + "@example.com";
        String registration = """
                {"email":"%s","displayName":"Divya","password":"SecurePass123!"}
                """.formatted(email);

        mockMvc.perform(post("/api/auth/register").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registration))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.displayName").value("Divya"))
                .andExpect(jsonPath("$.role").value("CUSTOMER"))
                .andExpect(jsonPath("$.passwordHash").doesNotExist());

        var loginResult = mockMvc.perform(post("/api/auth/login").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"%s\",\"password\":\"SecurePass123!\"}".formatted(email)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email))
                .andReturn();
        Cookie sessionCookie = loginResult.getResponse().getCookie("SESSION");

        mockMvc.perform(get("/api/auth/me").cookie(sessionCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.displayName").value("Divya"));

        mockMvc.perform(post("/api/auth/logout").cookie(sessionCookie).with(csrf()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/auth/me").cookie(sessionCookie))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void rejectsUnauthenticatedCurrentCustomerRequest() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }
}
