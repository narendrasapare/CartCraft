# CartCraft

CartCraft is a modern e-commerce platform built with Java, Spring Boot, React,
TypeScript, PostgreSQL, and micro-frontends.

It is designed around clear domain boundaries, independently evolvable frontend
capabilities, reliable APIs, and production-oriented engineering practices.

## Project goals

- Provide a responsive product discovery and purchasing experience.
- Keep catalogue, cart, identity, order, and administration domains modular.
- Support independently developed and deployed frontend capabilities.
- Maintain reliable, secure, observable, and well-tested services.
- Record architectural decisions and their trade-offs.

## Technology direction

- **Backend:** Java, Spring Boot, Maven, PostgreSQL
- **Frontend:** React, TypeScript, Vite, micro-frontends
- **API:** REST and OpenAPI
- **Testing:** JUnit, Testcontainers, Vitest, React Testing Library
- **Infrastructure:** Docker Compose initially; CI/CD and Kubernetes later

## Repository structure

```text
CartCraft/
|-- assets/          # Branding, product images, and placeholders
|-- backend/         # Spring Boot modular monolith
|-- docs/            # Architecture, domain, API, and operational documentation
|-- frontend/        # React shell, micro-frontends, and shared packages
|-- infrastructure/  # Local containers and deployment configuration
|-- .gitignore
`-- README.md
```

## First milestone: Catalogue v1

The first milestone delivers the Catalogue v1 foundation:

1. Create the repository and development foundations.
2. Model products and categories in PostgreSQL.
3. Expose a tested product catalogue REST API.
4. Create the React shell and catalogue micro-frontend foundation.
5. Display a responsive catalogue with product images.
6. Add filtering, sorting, and pagination.
7. Document the architecture, API contracts, and operational decisions.

## Current status

Repository foundation in progress.
