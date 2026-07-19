package com.cartcraft.identity.api;

public record CsrfTokenResponse(String headerName, String token) {
}
