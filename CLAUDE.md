# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hvoya CRM is a full-stack application for managing products, orders, users, and deliveries. The backend is NestJS (in the repo root `/src`) and the frontend is Angular 18 (in `/client`). The NestJS server serves the compiled Angular app as static files in production.

## Commands

### Backend (root directory)

```bash
npm run start:dev          # Start with hot reload
npm run start:test         # Start with test DB (NODE_ENV=test)
npm run build              # Compile to dist/
npm run lint               # ESLint with auto-fix
npm test                   # Jest unit tests (runs serially with --runInBand)
npm run test:watch         # Jest in watch mode
npm run test:e2e           # Jest e2e tests (./test/jest-e2e.json)
```

### Database (root directory)

```bash
npm run migrations:generate --name=<MigrationName>   # Generate migration from entity diff
npm run migrations:run                                # Apply pending migrations
npm run migrations:revert                             # Revert last migration
npm run db:setup           # Drop and recreate dev DB
npm run db:setup-test      # Drop, recreate, and seed test DB
npm run db:seed            # Seed data only
npm run db:reset           # Drop schema + run all migrations
```

### Frontend (client/ directory)

```bash
npm run start              # Angular dev server (port 4200)
npm run start:test         # Angular test server (port 4201, test configuration)
npm run build              # Production build
npm test                   # Karma/Jasmine unit tests (no watch)
npm run test:watch         # Unit tests in watch mode
```

### E2E Tests (client/ directory)

```bash
# Terminal 1 (root): npm run start:test
# Terminal 2 (client): npm run start:test
npm run cypress:open       # Open Cypress UI
npm run cypress:start      # Run Cypress headless
```

## Architecture

### Backend structure

```
src/
  app.module.ts            # Root module — registers all feature modules
  entities/                # TypeORM entities (shared across modules)
  dtos/                    # Request/response DTOs (shared)
  enums/                   # Shared enums (Role, Action, etc.)
  interfaces/              # Shared TypeScript interfaces
  decorators/              # Custom param decorators
  modules/
    auth/                  # JWT + Basic auth strategies, guards
    casl/                  # CASL ability factory — all authorization rules
    users/                 # User CRUD
    account/               # Self-service account management
    products/              # Products, variants, categories, colors, sizes
    orders/                # Order management
    cart/                  # Shopping cart
    balance/               # User balance
    transfer/              # Product stock transfers
    analytics/             # Admin and personal analytics
    notifications/         # In-app notifications
    requests/              # Order return & funds-withdraw requests (strategy pattern)
    payment-transactions/  # Payment transaction records
    posts/                 # Blog/news posts
    faq/                   # FAQ management
    mail/                  # Email sending via nodemailer/Sendinblue
    cloudinary/            # Image upload to Cloudinary
    files/                 # File management
    export/                # Data export (XLSX)
    setup/                 # App initialization
    database/              # TypeORM config, migrations, seeds, subscribers
    integrations/
      one-c/               # 1C ERP integration (two-way: API calls + webhook receiver)
      delivery/            # Nova Poshta & UkrPoshta delivery status tracking
      payment/             # PrivatBank payment gateway
  gateways/websocket/      # Socket.IO gateway for real-time notifications
```

### Path aliases (tsconfig.json)

| Alias | Resolves to |
|---|---|
| `@entities/*` | `src/entities/*` |
| `@dtos/*` | `src/dtos/*` |
| `@enums/*` | `src/enums/*` |
| `@interfaces/*` | `src/interfaces/*` |
| `@modules/*` | `src/modules/*` |
| `@auth/*` | `src/modules/auth/*` |
| `@decorators/*` | `src/decorators/*` |
| `@utils/*` | `src/utils/*` |
| `@constants/*` | `src/constants/*` |
| `@gateways/*` | `src/gateways/*` |

### Authorization model

Authorization uses CASL. `CaslAbilityFactory` (`src/modules/casl/casl-ability/casl-ability.factory.ts`) defines all permissions for three roles:

- **SuperAdmin** — full access except cannot add to cart or create requests
- **Admin** — manages users (non-SuperAdmin), products, orders, FAQs, balance, notifications, posts; can approve/decline requests
- **User** — accesses only own resources (cart, orders, balance, notifications)

Field-level permissions are defined in `src/modules/casl/casl-ability/permitted-fields/` and control which entity fields each role can read/write.

### Product data model

Products have a three-level hierarchy:
- `ProductCategoryEntity` → `ProductBaseEntity` → `ProductVariantEntity`
- `ProductVariantEntity` has a one-to-one `ProductPropertiesEntity` (stock, price, images, size, color, isPublished, etc.)

### Environment configuration

Environment files live in `env/`. The active file is selected by `NODE_ENV`:
- Default (development): `env/.env`
- Test: `env/test.env`

Copy `env/example.env` to `env/.env` and fill in values. Required variables: `DB_*`, `JWT_SECRET`. Optional: `CLOUDINARY_*`, `MAIL_*`, `NOVA_POSHTA_API_KEY`, `UKR_POSHTA_AUTH_TOKEN`, `ONE_C_*`, `AWS_*`.

### Adding a new entity

1. Create entity file in `src/entities/`
2. Register it with `TypeOrmModule.forFeature([...])` in the relevant module
3. Generate migration: `npm run migrations:generate --name=<Name>`
4. Run migration: `npm run migrations:run`

### Frontend structure

```
client/src/app/
  app.module.ts / app-routing.module.ts   # Root — lazy loads three route groups
  modules/
    auth/                  # Sign-in, sign-up, password reset, email confirm
    admin/                 # Admin portal (role: Admin/SuperAdmin)
      modules/
        users/             # User management
        products/          # Product CRUD + attributes (colors, sizes, package sizes)
        orders/            # Order list and detail
        requests/          # Return & funds-withdraw request management
        faq/               # FAQ editor
        posts/             # Post editor
        account/           # Admin account settings
    dashboard/             # Customer portal (role: User)
      modules/
        products/          # Product catalog
        cart/              # Shopping cart
        orders/            # Order history
        balance/           # Balance and transactions
        requests/          # Customer requests
        faq/               # FAQ viewer
        account/           # Profile settings
  shared/
    services/              # All HTTP API calls (one service per resource)
    guards/                # SignedIn, SignedOut, Role guards
    interfaces/            # TypeScript interfaces + CASL ability definition
    layout/                # App shell (sidebar, topbar)
    shared.module.ts       # Common imports re-exported to feature modules
```

The frontend mirrors the backend's CASL model. `PoliciesService` builds an `AppAbility` instance from the JWT-decoded permissions. The `RoleGuard` and `*ngIf="ability.can(...)"` directives control access.

All API calls go through services in `client/src/app/shared/services/`. All API routes are prefixed with `/api`.

### All API routes are prefixed with `/api`

The backend runs on port `3000` by default; the Angular dev server proxies `/api` calls to it.
