# ADR 0001: Use a monorepo

## Status

Accepted

## Context

CartCraft contains a Spring Boot backend, React micro-frontends, shared frontend
packages, infrastructure configuration, assets, and technical documentation.
These parts must evolve together while the initial product and domain boundaries
are being established.

## Decision

Store CartCraft's application code, shared packages, infrastructure, assets, and
technical documentation in one Git repository.

The repository will preserve clear top-level boundaries between backend,
frontend, infrastructure, assets, and documentation.

## Alternatives considered

### Multiple repositories

Each backend service, micro-frontend, or shared package could use a separate
repository.

This provides stronger repository-level isolation but introduces additional
versioning, coordination, permissions, and CI/CD overhead before independent
release boundaries are established.

## Consequences

### Positive

- Related changes can be reviewed and committed together.
- Local development and integration testing are easier to coordinate.
- Shared standards and documentation remain discoverable.
- Initial CI/CD configuration can be managed centrally.

### Negative

- Repository size and build times may grow.
- Unrelated components can become accidentally coupled.
- CI pipelines must eventually detect and build only affected components.

## Review conditions

Reconsider this decision if repository size, access-control requirements,
independent release ownership, or CI performance become significant constraints.