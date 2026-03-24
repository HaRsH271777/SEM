# ARCHGUARD.md — Architectural Rules
# This file is read by ArchGuard to enforce architectural constraints.
# Format: - [TYPE] Description. (scope: glob-pattern)
# Types: DO, DO NOT, PATTERN, CONSTRAINT

- [DO] Write a unit test for every new class or service. (scope: *.service.ts)
- [DO NOT] Import database modules directly in controller files. (scope: *.controller.ts)
- [DO NOT] Use console.log in production code. Use the Logger service. (scope: src/**/*.ts)
- [PATTERN] All HTTP routes must be registered through the Router class.
- [CONSTRAINT] The auth module must not import from the payment module.
- [CONSTRAINT] The database module must not import from the HTTP layer.
