package com.cartcraft.cart.api;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record UpdateCartItemRequest(
        @Min(1) @Max(99) int quantity
) {
}
