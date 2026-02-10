# 🛠️ Tech Stack Overview

## Core Framework
- **Next.js 15** - React framework với App Router, Server Components, Server Actions
- **React 19** - UI library mới nhất với hooks và concurrent features
- **TypeScript 5.7** - Static typing với strict mode

## Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **tailwindcss-animate** - Animation utilities
- **CSS Variables** - Dark mode support
- **PostCSS** - CSS processing

## State Management
- **Zustand 5.0** - Lightweight state management
  - `devtools` middleware cho debugging
  - `persist` middleware cho localStorage
  - Type-safe stores với TypeScript

## Data Fetching
- **TanStack Query (React Query) 5.x** - Server state management
  - Automatic caching
  - Background refetching
  - DevTools integration
- **Axios 1.7** - HTTP client
  - Request/response interceptors
  - Type-safe API calls
  - Automatic token management

## Form & Validation
- **React Hook Form 7.x** - Performant form library
  - Minimal re-renders
  - Built-in validation
  - Easy integration với UI libraries
- **Zod 3.x** - TypeScript-first schema validation
  - Type inference
  - Detailed error messages
  - Composable schemas

## UI Components & Animation
- **Radix UI** - Unstyled, accessible components
- **Class Variance Authority (CVA)** - Component variants
- **Framer Motion 11.x** - Production-ready animation library
- **Lucide React** - Beautiful, consistent icons
- **next-themes** - Dark mode implementation
- **Sonner** - Toast notifications
- **tailwind-merge** - Merge Tailwind classes
- **clsx** - Conditional className utility

## Fonts
- **Geist Sans & Mono** - Modern font family

## Developer Tools

### Code Quality
- **ESLint 9.x** - Linting với Next.js config
- **Prettier 3.x** - Code formatting
  - `prettier-plugin-tailwindcss` - Sort Tailwind classes
- **TypeScript ESLint** - TypeScript-specific linting

### Git Hooks
- **Husky 9.x** - Git hooks management
- **Lint-staged 15.x** - Run linters on staged files
  - Pre-commit: ESLint + Prettier

### Testing
- **Jest 29.x** - Testing framework
- **Testing Library** - React component testing
- **jest-environment-jsdom** - DOM environment cho tests

## Utilities
- **date-fns 4.x** - Modern date utility library
- **Custom Hooks** - Reusable logic
  - `useDebounce` - Debounce values
  - `useLocalStorage` - Persist state
  - `useMediaQuery` - Responsive hooks
  - `useOnClickOutside` - Outside click detection

## Development Features

### Built-in Next.js Features
- ✅ App Router với nested layouts
- ✅ Server Components (default)
- ✅ Client Components (when needed)
- ✅ API Routes với Route Handlers
- ✅ Middleware support
- ✅ Image Optimization
- ✅ Font Optimization
- ✅ Metadata API cho SEO
- ✅ Streaming với Suspense
- ✅ Parallel Routes
- ✅ Intercepting Routes

### Performance Optimizations
- ✅ Automatic code splitting
- ✅ Tree shaking
- ✅ Bundle optimization
- ✅ Image lazy loading
- ✅ Font subsetting
- ✅ SWC compiler (faster than Babel)
- ✅ Turbopack (dev mode)

### Developer Experience
- ✅ Hot Module Replacement (HMR)
- ✅ Fast Refresh
- ✅ TypeScript strict mode
- ✅ Path aliases (`@/*`)
- ✅ ESLint auto-fix
- ✅ Prettier auto-format
- ✅ Git hooks automation
- ✅ VS Code settings included

## Production Features

### Deployment Ready
- ✅ Docker support với multi-stage builds
- ✅ Environment variables setup
- ✅ Production build optimization
- ✅ Static & Dynamic rendering
- ✅ ISR (Incremental Static Regeneration)
- ✅ Edge Runtime support

### SEO & Accessibility
- ✅ Metadata API
- ✅ OpenGraph tags
- ✅ Twitter cards
- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation

### Security
- ✅ TypeScript type safety
- ✅ Zod runtime validation
- ✅ CSP headers support
- ✅ CORS configuration
- ✅ Secure headers (via middleware)

## Architecture Patterns

### File Structure
```
src/
├── app/           # Next.js App Router (routes, layouts)
├── components/    # Reusable components
│   ├── ui/       # Base UI components
│   └── features/ # Feature-specific components
├── hooks/        # Custom React hooks
├── lib/          # Utility functions, helpers
├── store/        # Zustand stores
├── types/        # TypeScript types/interfaces
├── config/       # App configuration
└── styles/       # Global styles
```

### Design Patterns
- **Server-first approach** - Fetch data on server when possible
- **Progressive Enhancement** - Works without JS, better with JS
- **Composition over Inheritance** - Composable components
- **Separation of Concerns** - Clear boundaries between layers
- **Type Safety** - TypeScript everywhere
- **Error Boundaries** - Graceful error handling

## Package Manager Agnostic
Works with:
- ✅ npm
- ✅ pnpm
- ✅ yarn
- ✅ bun

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Node Version
- **Required**: Node.js 18.17 or later
- **Recommended**: Node.js 20.x LTS

## Why This Stack?

### Next.js 15
- Industry standard for React production apps
- Best-in-class DX và performance
- Built-in optimizations
- Great documentation

### TypeScript
- Catch errors at compile time
- Better IDE support
- Self-documenting code
- Easier refactoring

### Tailwind CSS
- Rapid development
- Consistent design system
- Small bundle size
- No naming fatigue

### Zustand
- Minimal boilerplate
- Better performance than Context API
- DevTools support
- Easy to learn

### React Query
- Eliminates boilerplate for server state
- Automatic caching
- Background updates
- Better UX

### Zod + React Hook Form
- Type-safe forms
- Runtime validation
- Great DX
- Minimal re-renders

## Future Considerations

Có thể thêm sau:
- **Storybook** - Component documentation
- **Playwright** - E2E testing
- **MSW** - API mocking
- **React Email** - Email templates
- **tRPC** - End-to-end type safety
- **Prisma** - Database ORM
- **NextAuth** - Authentication
- **Sentry** - Error tracking
- **Analytics** - Usage tracking

## Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://zustand-demo.pmnd.rs)
- [React Hook Form Docs](https://react-hook-form.com)
- [Zod Docs](https://zod.dev)

---

Stack được chọn dựa trên:
✅ Production-ready
✅ Developer Experience
✅ Performance
✅ Community Support
✅ Maintainability
✅ Scalability
