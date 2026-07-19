package com.cartcraft.identity.application;

import com.cartcraft.identity.domain.Customer;
import com.cartcraft.identity.infrastructure.CustomerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Locale;
import java.util.UUID;

@Service
@Transactional
public class CustomerIdentityService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerIdentityService(CustomerRepository customerRepository, PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Customer register(String email, String displayName, String password) {
        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        if (customerRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account already exists for this email");
        }
        Customer customer = new Customer(
                UUID.randomUUID(),
                normalizedEmail,
                displayName.trim(),
                passwordEncoder.encode(password),
                Instant.now()
        );
        try {
            return customerRepository.saveAndFlush(customer);
        } catch (DataIntegrityViolationException exception) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account already exists for this email", exception);
        }
    }

    @Transactional(readOnly = true)
    public Customer requireByEmail(String email) {
        return customerRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("Customer not found"));
    }

    public UserDetailsService userDetailsService() {
        return email -> {
            Customer customer = requireByEmail(email);
            return User.withUsername(customer.getEmail())
                    .password(customer.getPasswordHash())
                    .roles(customer.getRole())
                    .disabled(!customer.isEnabled())
                    .build();
        };
    }
}
