package com.cartcraft.identity.api;

import com.cartcraft.identity.domain.Customer;

import java.util.UUID;

public record CustomerResponse(UUID id, String email, String displayName, String role) {
    public static CustomerResponse from(Customer customer) {
        return new CustomerResponse(customer.getId(), customer.getEmail(), customer.getDisplayName(), customer.getRole());
    }
}
