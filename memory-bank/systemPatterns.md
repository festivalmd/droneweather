# System Patterns: Aero Drone Flight Analysis

## Architecture Overview

### Application Type
- Single Page Application (SPA)
- Client-side rendering with React
- No backend server (MVP phase)
- Static UI with mock data (ready for API integration)

### Component Architecture
```
App.tsx (Root)
├── QueryClientProvider (TanStack Query)
├── TooltipProvider (Radix UI)
├── Toaster (react-hot-toast)
├── Sonner (sonner)
└── BrowserRouter
    └── Routes
        ├── Index (Home Page)
        │   ├── AeroHeader
        │   ├── AeroHero
        │   ├── AeroForm
        │   ├── AeroDashboard
        │   └── AeroFooter
        └── NotFound (404 Page)
```

## Design Patterns

### Component Structure
Each major component follows this pattern:
- Functional component with TypeScript
- Export as default
- Inline styles via Tailwind classes
- Props minimal (mostly self-contained)

### State Management
- Local state with React hooks (useState, useEffect)
- No global state management (MVP phase)
- TanStack Query configured for future API calls
- Form state managed locally in AeroForm

### Styling Patterns
- Tailwind CSS utility-first approach
- CSS variables for theming (defined in index.css)
- Custom animations defined in tailwind.config.ts
- Responsive design with md: breakpoints

### Animation Patterns
Three custom animations defined:
1. `fade-in-up`: Elements fade in while moving up (600ms ease-out)
2. `float`: Continuous floating motion (4s infinite)
3. `pulse-glow`: Pulsing glow effect (3s infinite)

Animation delays are used to create staggered reveal effects.

## Key Technical Decisions

### UI Framework
- **shadcn/ui**: Component library built on Radix UI primitives
- Provides accessible, customizable components
- Components stored in `src/components/ui/`

### Styling Approach
- **Tailwind CSS**: Utility-first CSS framework
- **CSS Variables**: For theme customization
- **Inter font**: Clean, professional typeface

### Form Handling
- Native HTML form elements
- shadcn/ui Select component for dropdown
- No form validation library (MVP phase)
- Ready for react-hook-form integration

### Routing
- **React Router v6**: Client-side routing
- Only two routes: Home (/) and NotFound (*)
- Easy to extend for future pages

## Data Flow (Current MVP)

### Mock Data Pattern
Currently, the dashboard displays hardcoded data:
- Wind: 12 m/s (red/warning)
- Temperature: -2°C
- Visibility: 10 km
- Drone max wind: 10.7 m/s

### Future Data Flow
```
User Input → API Request → Data Processing → Dashboard Display
     ↓            ↓              ↓                ↓
  Location    Weather API    Compare specs    Status cards
  Drone Model  Laws API      Check rules      Warnings
```

## Component Relationships

### AeroForm → AeroDashboard
- Currently not connected (static data)
- Future: Form submission will trigger dashboard update
- Will use state lifting or context for communication

### AeroHero → AeroForm
- Visual hierarchy: Hero → Form (user flows down)
- Hero provides context, Form provides action

### Shared Components
- All components use shadcn/ui primitives
- Consistent styling via CSS variables
- Icons from lucide-react

## Error Handling Patterns

### Current State
- NotFound page for 404 errors
- No API error handling (no API calls yet)

### Future Considerations
- TanStack Query for API error handling
- Toast notifications for user feedback
- Graceful degradation for API failures

## Performance Considerations

### Current Optimizations
- Vite for fast development and builds
- Code splitting ready (React.lazy)
- Images optimized (drone-hero.png)
- CSS animations (GPU-accelerated)

### Future Optimizations
- Image optimization/CDN
- API response caching
- Service worker for offline support
- Lazy loading for components