# Tech Context: Aero Drone Flight Analysis

## Technology Stack

### Core Framework
- **React 18.3.1**: UI library
- **TypeScript 5.8.3**: Type safety
- **Vite 5.4.19**: Build tool and dev server

### UI & Styling
- **Tailwind CSS 3.4.17**: Utility-first CSS
- **shadcn/ui**: Component library (Radix UI primitives)
- **Lucide React 0.462.0**: Icon library
- **Inter**: Google Fonts typeface

### State & Data
- **TanStack React Query 5.83.0**: Server state management (configured, not actively used yet)
- **React Router DOM 6.30.1**: Client-side routing
- **React Hook Form 7.61.1**: Form handling (available, not yet integrated)
- **Zod 3.25.76**: Schema validation (available, not yet used)

### UI Components (Radix UI)
All shadcn/ui components are based on Radix UI primitives:
- Dialog, Alert Dialog, Dropdown Menu
- Select, Checkbox, Radio Group
- Tabs, Accordion, Collapsible
- Tooltip, Popover, Hover Card
- Toast, Sonner (notifications)
- And many more...

### Development Tools
- **ESLint 9.32.0**: Linting
- **Vitest 3.2.4**: Unit testing
- **Playwright 1.57.0**: E2E testing
- **PostCSS 8.5.6**: CSS processing
- **Autoprefixer 10.4.21**: CSS vendor prefixes

## Project Structure

```
content-craft-studio-main/
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── assets/
│   │   └── drone-hero.png
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── AeroDashboard.tsx
│   │   ├── AeroFooter.tsx
│   │   ├── AeroForm.tsx
│   │   ├── AeroHeader.tsx
│   │   ├── AeroHero.tsx
│   │   └── NavLink.tsx
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── test/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

## Configuration Files

### package.json
- Project name: `vite_react_shadcn_ts`
- Scripts: dev, build, lint, preview, test, test:watch
- Uses npm/bun as package manager

### tailwind.config.ts
- Dark mode enabled via class strategy
- Custom color palette using CSS variables
- Custom animations: fade-in-up, float, pulse-glow
- Extended theme with shadcn/ui design tokens

### tsconfig.json
- Strict TypeScript mode
- Path aliases configured (@/ for src/)
- React JSX support

### vite.config.ts
- React SWC plugin for fast compilation
- Path resolution for @/ imports
- Vite plugin for component tagging (development)

## CSS Architecture

### CSS Variables (index.css)
HSL-based color system:
- Background: Dark blue-gray (222 47% 5%)
- Foreground: Light gray (210 40% 98%)
- Primary: Purple-blue (250 80% 62%)
- Status colors: Destructive (red), Warning (orange), Success (green)

### Font Loading
- Google Fonts CDN for Inter font
- Weights: 300, 400, 500, 600, 700, 800

## Testing Setup

### Unit Testing (Vitest)
- Configured in vitest.config.ts
- jsdom for DOM testing
- Testing Library for React component testing
- Jest DOM matchers available

### E2E Testing (Playwright)
- Configured in playwright.config.ts
- fixture file: playwright-fixture.ts

## Build & Development

### Development Server
```bash
npm run dev
# or
bun run dev
```
- Hot Module Replacement (HMR)
- Fast refresh with React SWC

### Production Build
```bash
npm run build
# or
bun run build
```
- Optimized bundle
- Tree-shaking
- Code splitting ready

### Linting
```bash
npm run lint
```
- ESLint with React hooks plugin
- React refresh plugin

## Dependencies Status

### Actively Used
- React, React DOM, React Router
- Tailwind CSS and plugins
- shadcn/ui components (Radix UI)
- Lucide icons
- class-variance-authority, clsx, tailwind-merge

### Configured but Not Yet Used
- TanStack Query (ready for API integration)
- React Hook Form (ready for form validation)
- Zod (ready for schema validation)
- Recharts (available for charts/graphs)
- date-fns (available for date formatting)
- sonner (available for toast notifications)

## Browser Support
- Modern browsers (ES2020+)
- Mobile responsive
- Dark theme by default