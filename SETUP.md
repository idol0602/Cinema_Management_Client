# 🚀 Hướng Dẫn Setup Chi Tiết

## Bước 1: Cài Đặt Dependencies

```bash
npm install
```

Hoặc sử dụng package manager khác:

```bash
# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Bước 2: Environment Variables

Tạo file `.env.local`:

```bash
cp .env.example .env.local
```

Nội dung `.env.local`:

```env
# Application
NEXT_PUBLIC_APP_NAME=Modern Next.js App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## Bước 3: Setup Git Hooks (Husky)

```bash
npm run prepare
```

Lệnh này sẽ:
- Cài đặt Husky
- Thiết lập pre-commit hooks
- Enable lint-staged

## Bước 4: Chạy Development Server

```bash
npm run dev
```

Truy cập [http://localhost:3000](http://localhost:3000)

## 🔧 Các Lệnh Quan Trọng

### Development
```bash
npm run dev          # Chạy dev server (port 3000)
npm run build        # Build production
npm run start        # Chạy production server
```

### Code Quality
```bash
npm run lint         # Kiểm tra lỗi ESLint
npm run lint:fix     # Tự động fix lỗi ESLint
npm run format       # Format code với Prettier
npm run type-check   # Kiểm tra TypeScript types
```

### Testing
```bash
npm run test         # Chạy tests
npm run test:watch   # Chạy tests ở watch mode
```

## 📁 Cấu Trúc Project

```
src/
├── app/                  # Next.js App Router
│   ├── layout.tsx       # Root layout (providers, fonts)
│   └── page.tsx         # Home page
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── button.tsx
│   │   └── card.tsx
│   └── providers/       # React providers
│       ├── theme-provider.tsx
│       └── query-provider.tsx
├── hooks/               # Custom hooks
│   └── index.ts
├── lib/                 # Utilities
│   ├── utils.ts         # Helper functions
│   └── api-client.ts    # Axios instance
├── store/               # Zustand stores
│   └── index.ts
├── types/               # TypeScript types
│   └── index.ts
├── config/              # App config
│   └── site.ts
└── styles/
    └── globals.css      # Global styles + Tailwind
```

## 🎨 Styling với Tailwind

### Dark Mode
Project đã setup dark mode với next-themes:

```tsx
import { useTheme } from 'next-themes';

function Component() {
  const { theme, setTheme } = useTheme();
  // theme: 'light' | 'dark' | 'system'
}
```

### CSS Variables
Sử dụng CSS variables trong `globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  /* ... */
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  /* ... */
}
```

### Tailwind Classes
```tsx
<div className="bg-background text-foreground">
  <h1 className="text-primary">Hello</h1>
</div>
```

## 🔄 State Management

### Zustand Store Example
```tsx
import { useAuthStore } from '@/store';

function Component() {
  const { user, login, logout } = useAuthStore();
  
  return (
    <div>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={() => login(userData)}>Login</button>
      )}
    </div>
  );
}
```

## 📡 Data Fetching với React Query

```tsx
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

function Component() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await apiClient.get('/users');
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  
  return <div>{JSON.stringify(data)}</div>;
}
```

## 📝 Form Handling

### React Hook Form + Zod
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

## 🎭 Animations với Framer Motion

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

## 🪝 Custom Hooks

### useDebounce
```tsx
import { useDebounce } from '@/hooks';

function SearchComponent() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    // API call với debouncedSearch
  }, [debouncedSearch]);
}
```

### useLocalStorage
```tsx
import { useLocalStorage } from '@/hooks';

function Component() {
  const [value, setValue] = useLocalStorage('key', 'default');
}
```

## 🔔 Toast Notifications

```tsx
import { toast } from 'sonner';

function Component() {
  const handleClick = () => {
    toast.success('Success message');
    toast.error('Error message');
    toast.info('Info message');
  };
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code lên GitHub
2. Import project vào Vercel
3. Deploy tự động

### Docker
```bash
# Build image
docker build -t modern-nextjs-app .

# Run container
docker run -p 3000:3000 modern-nextjs-app
```

### Manual Build
```bash
npm run build
npm run start
```

## 📚 Best Practices

### 1. Component Organization
```
components/
├── ui/              # Shared UI components
├── features/        # Feature-specific components
└── layouts/         # Layout components
```

### 2. Import Alias
Sử dụng `@/` thay vì relative paths:
```tsx
// ✅ Good
import { Button } from '@/components/ui/button';

// ❌ Bad
import { Button } from '../../../components/ui/button';
```

### 3. Type Safety
Luôn định nghĩa types:
```tsx
interface Props {
  title: string;
  count: number;
}

function Component({ title, count }: Props) {
  // ...
}
```

### 4. Server vs Client Components
```tsx
// Server Component (default)
async function ServerComponent() {
  const data = await fetch('...');
  return <div>{data}</div>;
}

// Client Component
'use client';
function ClientComponent() {
  const [state, setState] = useState();
  return <div>{state}</div>;
}
```

## ❓ Troubleshooting

### Port đã được sử dụng
```bash
# Kill process trên port 3000
npx kill-port 3000

# Hoặc dùng port khác
npm run dev -- -p 3001
```

### Module not found
```bash
# Clear cache và reinstall
rm -rf node_modules .next
npm install
```

### TypeScript errors
```bash
# Kiểm tra types
npm run type-check

# Rebuild
npm run build
```

## 📖 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)

## 🤝 Support

Nếu gặp vấn đề:
1. Kiểm tra README.md
2. Xem lại SETUP.md này
3. Google error message
4. Hỏi trên Discord/Slack team
