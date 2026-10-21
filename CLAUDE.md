# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projects Directory
- All of the user's (Ridwan Malik's) projects live in `D:\Projects` (`/d/Projects`) — this repository is one of them.

## Production URL
- The production URL is `https://ridwanmalik.com`.

## Development Commands

```bash
# Package Management
yarn install     # Install all dependencies (preferred over npm)

# Development server
yarn dev          # Start development server on http://localhost:3000

# Building and production
yarn build        # Build for production
yarn start        # Start production server

# Code quality
yarn lint         # Run ESLint for code linting

# IMPORTANT: Always use yarn, never use npm
# The project uses yarn.lock, not package-lock.json
```

## Project Architecture

This is a Next.js 15 personal portfolio website using the App Router architecture.

### Core Structure
- **App Router**: Uses the new Next.js App Router (`app/` directory)
- **Component Architecture**: Modular component system organized by type
  - `components/layouts/`: Layout components (Navbar)
  - `components/pages/`: Page-specific components (Home, About, Experience, Projects, Contact)
  - `components/shared/`: Shared/reusable components (Header)
  - Barrel exports via `index.ts` files for clean imports
- **Constants & Utils**: Centralized data management
  - `lib/constants.ts`: All static data (personal info, experiences, projects, etc.)
  - `lib/icons.tsx`: Reusable icon components

### Styling & Design
- **Tailwind CSS v3.4+**: Primary styling framework with custom configuration
- **Custom Theme**: Extended Tailwind config with:
  - Custom colors: oxford-blue (#0A192F), foreground (#ccd6f6), secondary (#8892b0), accent (#7CFAD6)
  - Custom background gradients (glowing-blue)
  - Custom font families (Calibre, Inter, SF Pro Text system fonts with monospace fallbacks)
- **Typography**: Uses professional font stack prioritizing system fonts (Calibre, SF Pro Text) with Inter fallback
- **Color System**: Unified custom color scheme replacing default Tailwind colors

### Code Standards
- **Package Manager**: Uses Yarn exclusively (yarn.lock present, no package-lock.json)
- **ESLint**: Uses Next.js core web vitals configuration
- **TypeScript**: Full TypeScript setup with strict typing
- **Import Patterns**: Consistent use of barrel exports and path aliases (`@/components`, `@/lib`)
- **Data Organization**: No magic strings - all content centralized in constants

### Key Files
- `app/layout.tsx`: Root layout with comprehensive metadata and font configuration
- `app/page.tsx`: Main page composing all portfolio sections
- `components/index.ts`: Central component export hub
- `lib/constants.ts`: Centralized data store (personal info, projects, experiences)
- `lib/icons.tsx`: Reusable SVG icon components
- `tailwind.config.ts`: Extended Tailwind configuration with custom theme
- `yarn.lock`: Yarn lockfile (DO NOT use npm or package-lock.json)

### Development Notes
- **DO NOT run yarn dev** unless explicitly requested
- Only run yarn lint, yarn build, or TypeScript checks when needed
- Always use yarn commands, never npm
- Follow the established custom color system (foreground, secondary, accent)

### Constants Organization
- **Global Constants (`lib/constants.ts`)**: Only for data reused across multiple components (personal info, technologies, section titles)
- **Local Constants**: Component-specific content should be defined as constants **OUTSIDE** the component function to avoid recreation on every render
- **Structure**: Use objects/arrays for better organization (e.g., `COMPONENT_CONTENT = { paragraphs: [], cta: { text: "", href: "" } }`)
- **No Magic Strings**: All text content should be extracted to constants (either global or local) to avoid magic strings in JSX
- **Performance**: Constants outside component functions are created once, not on every render

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
