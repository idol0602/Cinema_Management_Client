# ⚡ Quick Start Guide

## 🚀 Cài Đặt Nhanh (3 Phút)

### Bước 1: Cài Dependencies
```bash
npm install
```

### Bước 2: Chạy Dev Server
```bash
npm run dev
```

### Bước 3: Mở Browser
Truy cập: [http://localhost:3000](http://localhost:3000)

✅ **Done!** Project đã chạy.

---

## 📂 Cấu Trúc Quan Trọng

```
src/
├── app/              # Routes & Pages
│   ├── layout.tsx   # Root layout (providers, fonts)
│   ├── page.tsx     # Home page (/)
│   └── api/         # API routes
├── components/       # React components
│   ├── ui/          # Button, Card, etc.
│   └── providers/   # Context providers
├── hooks/           # Custom hooks
├── lib/             # Utils & helpers
├── store/           # Zustand stores
└── styles/          # Global CSS
```

---

## 🎯 Các Lệnh Cơ Bản

```bash
# Development
npm run dev              # Start dev server (port 3000)

# Build & Production
npm run build            # Build for production
npm run start            # Run production server

# Code Quality
npm run lint             # Check linting errors
npm run format           # Format code with Prettier
npm run type-check       # Check TypeScript types

# Testing
npm test                 # Run tests
```

---

## 🛠️ Tạo Component Mới

### 1. UI Component
```tsx
// src/components/ui/my-button.tsx
import { cn } from '@/lib/utils';

interface MyButtonProps {
  label: string;
  onClick?: () => void;
}

export function MyButton({ label, onClick }: MyButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-lg bg-primary px-4 py-2',
        'text-white hover:bg-primary/90'
      )}
    >
      {label}
    </button>
  );
}
```

### 2. Page Component
```tsx
// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold">About Page</h1>
    </div>
  );
}
```

### 3. API Route
```tsx
// src/app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const users = [{ id: 1, name: 'John' }];
  return NextResponse.json(users);
}
```

---

## 🎨 Styling với Tailwind

```tsx
// Basic usage
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Hello
</div>

// Dark mode
<div className="bg-white dark:bg-gray-900">
  Auto dark mode
</div>

// Responsive
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

// Using cn() helper
import { cn } from '@/lib/utils';

<div className={cn('p-4', isActive && 'bg-blue-500')}>
  Conditional classes
</div>
```

---

## 🔄 State Management

### Zustand Store
```tsx
// src/store/counter.ts
import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
}

export const useCounter = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// Usage in component
import { useCounter } from '@/store/counter';

function Component() {
  const { count, increment } = useCounter();
  return <button onClick={increment}>{count}</button>;
}
```

### React Query
```tsx
import { useQuery } from '@tanstack/react-query';

function Component() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users');
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  return <div>{JSON.stringify(data)}</div>;
}
```

---

## 📝 Forms với Validation

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register('email')}
          type="email"
          placeholder="Email"
          className="w-full rounded border p-2"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <input
          {...register('password')}
          type="password"
          placeholder="Password"
          className="w-full rounded border p-2"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <button type="submit" className="w-full rounded bg-blue-500 p-2 text-white">
        Submit
      </button>
    </form>
  );
}
```

---

## 🎭 Animations

```tsx
import { motion } from 'framer-motion';

function Component() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Animated content
    </motion.div>
  );
}
```

---

## 🌓 Dark Mode Toggle

```tsx
'use client';

import { useTheme } from 'next-themes';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  );
}
```

---

## 🔔 Toast Notifications

```tsx
import { toast } from 'sonner';

function Component() {
  return (
    <button onClick={() => toast.success('Success!')}>
      Show Toast
    </button>
  );
}
```

---

## 🚀 Deploy

### Vercel (1 Click)
1. Push code lên GitHub
2. Import vào [Vercel](https://vercel.com)
3. Deploy!

### Docker
```bash
docker build -t app .
docker run -p 3000:3000 app
```

---

## 📚 Tài Liệu Đầy Đủ

- `README.md` - Tổng quan project
- `SETUP.md` - Hướng dẫn setup chi tiết
- `TECH_STACK.md` - Công nghệ sử dụng
- `CONTRIBUTING.md` - Hướng dẫn contribute

---

## ❓ Troubleshooting

### Port đã sử dụng?
```bash
npx kill-port 3000
# or
npm run dev -- -p 3001
```

### Module not found?
```bash
rm -rf node_modules .next
npm install
```

### Type errors?
```bash
npm run type-check
```

---

## 🆘 Cần Giúp Đỡ?

1. Đọc docs trong project
2. Check [Next.js Docs](https://nextjs.org/docs)
3. Google error message
4. Mở GitHub Issue

---

Happy Coding! 🎉
