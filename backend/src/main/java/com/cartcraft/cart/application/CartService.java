package com.cartcraft.cart.application;

import com.cartcraft.cart.api.CartItemResponse;
import com.cartcraft.cart.api.CartResponse;
import com.cartcraft.cart.domain.CartItem;
import com.cartcraft.cart.domain.GuestCart;
import com.cartcraft.cart.infrastructure.CartItemRepository;
import com.cartcraft.cart.infrastructure.GuestCartRepository;
import com.cartcraft.catalogue.infrastructure.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.UUID;

@Service
@Transactional
public class CartService {

    private final GuestCartRepository guestCartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartService(
            GuestCartRepository guestCartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository
    ) {
        this.guestCartRepository = guestCartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    public CartResponse createCart() {
        GuestCart cart = guestCartRepository.save(new GuestCart(UUID.randomUUID(), Instant.now()));
        return CartResponse.from(cart.getId(), java.util.List.of());
    }

    @Transactional(readOnly = true)
    public CartResponse getCart(UUID cartId) {
        requireCart(cartId);
        return buildResponse(cartId);
    }

    public CartResponse updateItem(UUID cartId, Long productId, int quantity) {
        GuestCart cart = requireCart(cartId);
        var product = productRepository.findByIdAndActiveTrue(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        CartItem item = cartItemRepository.findByCartIdAndProductId(cartId, productId)
                .orElseGet(() -> new CartItem(cart, product, quantity));
        item.changeQuantity(quantity);
        cartItemRepository.save(item);
        cart.touch(Instant.now());
        return buildResponse(cartId);
    }

    public CartResponse removeItem(UUID cartId, Long productId) {
        GuestCart cart = requireCart(cartId);
        cartItemRepository.findByCartIdAndProductId(cartId, productId)
                .ifPresent(cartItemRepository::delete);
        cart.touch(Instant.now());
        cartItemRepository.flush();
        return buildResponse(cartId);
    }

    private GuestCart requireCart(UUID cartId) {
        return guestCartRepository.findById(cartId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));
    }

    private CartResponse buildResponse(UUID cartId) {
        var items = cartItemRepository.findAllByCartIdOrderByIdAsc(cartId)
                .stream()
                .map(CartItemResponse::from)
                .toList();
        return CartResponse.from(cartId, items);
    }
}
