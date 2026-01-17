# 🧠 TODO (DDD)

API de gerenciamento de tarefas construída com **Domain-Driven Design**, **Clean Architecture** e **TDD**, focada em clareza de domínio, baixo acoplamento e evolução segura.

Este projeto foi desenvolvido como **laboratório prático de arquitetura backend**, priorizando decisões reais em vez de atalhos.
Ainda há **muito a aprender** e a ser implementado.

### ✨ Destaques
- DDD aplicado na prática (Aggregates, VOs, Domain Events)
- Use Cases explícitos com `Either` (sem exceções para fluxo)
- Fastify + validação nativa por schema
- Prisma + PostgreSQL com mappers de domínio
- Outbox Pattern para eventos confiáveis
- Testes unitários, HTTP e integração real

### 🧪 Testes
- Unitários (domínio e use cases)
- HTTP (Fastify inject)
- Integração real com Prisma + Postgres

### 🛠️ Stack
Node.js · TypeScript · Fastify · Prisma · PostgreSQL · Vitest · Docker

> Projeto focado em **arquitetura, design e qualidade de código**, não apenas em features, UI ou deploy... Por enquanto!!
