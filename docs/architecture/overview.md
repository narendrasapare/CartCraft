# CartCraft architecture overview

## Purpose

CartCraft is an e-commerce platform supporting product discovery, cart
management, customer accounts, checkout, orders, inventory, and administration.

This document describes the target architecture. Sections will be updated as
capabilities are implemented.

## System structure

CartCraft uses a monorepo containing:

- A Spring Boot backend
- React and TypeScript micro-frontends
- Shared frontend packages
- Infrastructure configuration
- Product and branding assets
- Technical documentation

## Backend

The backend will begin as a modular monolith. Business capabilities will be
separated into modules with explicit responsibilities and controlled
dependencies.

Initial modules:

- Catalogue
- Inventory
- Cart
- Identity
- Orders

Additional modules will be introduced when required.

Each module should organize its code around its business capability rather than
acting as a global technical layer shared by every domain.

## Frontend

The frontend will use React and TypeScript.

Initial applications:

- `shell` — layout, navigation, routing, and application composition
- `catalog-mfe` — product discovery, categories, search, and product details

Later micro-frontends may include cart, account, checkout, and administration.

Shared packages will be limited to stable cross-application concerns such as UI
components, API contracts, authentication contracts, and observability.

## Data

PostgreSQL will initially provide persistent storage.

Backend modules will own their domain models and database interactions. Modules
must not modify another module's data through internal implementation details.

## Communication

The browser will communicate with the backend through versioned REST APIs using
JSON.

Backend modules will initially communicate in-process through