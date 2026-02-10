# Modern Next.js Project

Một template Next.js hiện đại với đầy đủ công nghệ mới nhất, sẵn sàng cho production.

## 🚀 Tech Stack

### Core
- **Next.js 15** - React framework với App Router
- **React 19** - UI library mới nhất
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework

### State Management & Data Fetching
- **Zustand** - Lightweight state management
- **TanStack Query (React Query)** - Server state management
- **Axios** - HTTP client với interceptors

### Form & Validation
- **React Hook Form** - Performant form library
- **Zod** - TypeScript-first schema validation

### UI & Animation
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icon library
- **next-themes** - Dark mode support
- **Sonner** - Toast notifications
- **CVA (Class Variance Authority)** - Component variants
- **tailwind-merge & clsx** - Utility class merging

### Developer Experience
- **ESLint** - Linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Lint-staged** - Run linters on staged files
- **Jest** - Testing framework
- **Testing Library** - React testing utilities

## 📁 Cấu Trúc Thư Mục

```
modern-nextjs-project/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # React components
│   │   ├── ui/                 # UI components (Button, Card, etc.)
│   │   └── providers/          # Context providers
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   ├── store/                  # Zustand stores
│   ├── types/                  # TypeScript types
│   ├── config/                 # App configuration
│   └── styles/                 # Global styles
├── public/                     # Static assets
├── .husky/                     # Git hooks
├── next.config.ts              # Next.js config
├── tailwind.config.ts          # Tailwind config
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

## 🛠️ Setup & Installation

### 1. Cài đặt dependencies

```bash
npm install
# hoặc
pnpm install
# hoặc
yarn install
```

### 2. Thiết lập environment variables

```bash
cp .env.example .env.local
```

Chỉnh sửa `.env.local` với các giá trị của bạn.

### 3. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format code with Prettier
npm run type-check       # TypeScript type checking

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode

# Git Hooks
npm run prepare          # Setup Husky
```

## 🎨 Features

### ✅ Đã Tích Hợp

- ✨ Next.js 15 với App Router
- 🎨 Tailwind CSS với dark mode
- 📝 TypeScript strict mode
- 🔄 React Query cho data fetching
- 💾 Zustand cho state management
- 📋 React Hook Form + Zod validation
- 🎭 Framer Motion animations
- 🌓 Dark/Light theme toggle
- 🔔 Toast notifications (Sonner)
- 🎯 ESLint + Prettier
- 🐶 Husky + Lint-staged
- 🧪 Jest + Testing Library setup
- 📱 Responsive design
- ♿ Accessibility best practices
- 🚀 Performance optimizations

### 🎯 Component Library

Các UI components đã được tạo sẵn trong `src/components/ui/`:
- Button với variants
- Card components
- Theme toggle

### 🪝 Custom Hooks

Trong `src/hooks/`:
- `useDebounce` - Debounce values
- `useLocalStorage` - Persist state in localStorage
- `useMediaQuery` - Responsive hooks
- `useOnClickOutside` - Detect outside clicks

### 🗄️ State Management Examples

Zustand stores trong `src/store/`:
- Auth store với persist
- Counter store example

## 🔧 Configuration Files

- **next.config.ts** - Next.js configuration
- **tailwind.config.ts** - Tailwind customization
- **tsconfig.json** - TypeScript settings
- **.eslintrc.json** - ESLint rules
- **.prettierrc** - Prettier settings
- **jest.config.js** - Jest testing config

## 📚 Best Practices

1. **Type Safety**: Sử dụng TypeScript strict mode
2. **Code Organization**: Component-based architecture
3. **Performance**: Image optimization, code splitting
4. **Accessibility**: Semantic HTML, ARIA labels
5. **Testing**: Write tests for critical functionality
6. **Code Quality**: Pre-commit hooks với lint-staged
7. **Git Workflow**: Conventional commits

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
```

Deploy trên [Vercel](https://vercel.com) với 1 click.

### Docker

```bash
# Build image
docker build -t modern-nextjs-app .

# Run container
docker run -p 3000:3000 modern-nextjs-app
```

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://zustand-demo.pmnd.rs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own purposes.

---

Made with ❤️ using Next.js
