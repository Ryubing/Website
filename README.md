# ryujinx.app source code

## Getting started

### 1. Clone the repository

> `$ git clone https://github.com/Ryubing/Website`

### 2. Install dependencies

> `$ pnpm install`

### 3. Run dev server

> `$ pnpm dev`

## Available scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js development server at `http://localhost:3000` |
| `pnpm build` | Standard Next.js build |
| `pnpm preview` | Build + preview Cloudflare Worker locally |
| `pnpm deploy` | Build + deploy to Cloudflare Workers |
| `pnpm biome-write` | Format all files with Biome |
| `pnpm cf-typegen` | Regenerate Cloudflare environment types |
| `pnpm lint` | Run Next.js lint |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI Library | `@once-ui-system/core` |
| Styling | SCSS Modules (`*.module.scss`) + CSS custom properties |
| Language | TypeScript (strict mode) |
| Formatting | Biome v1.9.4 (formatter only, linter disabled) |
| Icons | `react-icons` (Hi, Hi2, Pi, Go, Si, Fa6 packs) |
| Deployment | Cloudflare Workers via `@opennextjs/cloudflare` |
| Package Manager | pnpm |

## Project structure

```
src/
├── app/                 # Next.js App Router pages + API routes
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── download/        # Downloads page (?rc= query param)
│   ├── donate/          # Donate page
│   ├── r/[slug]/        # URL redirect handler
│   └── api/             # API routes
│       ├── download/    # Download proxy (calls update.ryujinx.app API, falls back to Forgejo)
│       ├── authenticate/
│       ├── check-auth/
│       └── og/
├── components/          # Shared UI components
├── resources/           # Content, config, icons, theme
├── types/               # TypeScript type definitions
└── utils/               # Constants, date helpers, download logic
```

## Project conventions

- **Internal imports** use `@/` alias (maps to `./src/*`)
- **Pages** use default exports, **shared components** use named exports
- **Server components by default** — add `"use client"` for interactivity
- **SCSS Modules** for component styles, `classnames` for conditional classes
- **Search params** in Next.js 16 are `Promise` — must be `await`ed
- **Theme** configured in `src/resources/once-ui.config.ts` with custom brand colors in `custom.css`
- **Constants** in `src/utils/index.ts` as `Consts` class with static readonly properties

## Deployment

- Cloudflare Workers via `@opennextjs/cloudflare`
- Worker name: `ryubing-site`
- After changing Cloudflare bindings: `pnpm cf-typegen`
- Preview: `pnpm preview` | Deploy: `pnpm deploy`

## Formatting

```bash
pnpm biome-write
```

All files formatted with Biome (spaces, 2 indent, double quotes, 100 line width). Note: Biome linter is disabled — only formatting is active.
