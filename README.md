# Client - Giao Diện Người Dùng Quản Lý Rạp Chiếu Phim

## 📋 Giới Thiệu

Client là ứng dụng web frontend cho hệ thống quản lý rạp chiếu phim META CINEMA. Nó cung cấp giao diện thân thiện để người dùng có thể đặt vé, xem phim, thanh toán, và tương tác với các dịch vụ của rạp chiếu phim.

## 🛠️ Công Nghệ Sử Dụng

### Core Framework
- **Framework**: Next.js v15
- **React Version**: React 19
- **Language**: TypeScript (strict mode)
- **Node Version**: 18+

### UI & Styling
- **CSS Framework**: Tailwind CSS v3
- **UI Components**: Radix UI (Accessible, Headless)
- **Custom Components**: Built on top of Radix UI primitives
- **Icon Library**: Lucide React

### State Management & Forms
- **Global State**: Zustand
- **Form Management**: React Hook Form v7
- **Schema Validation**: Zod v3
- **Data Fetching**: TanStack React Query v5
- **HTTP Client**: Axios

### Real-time & Communication
- **WebSocket**: Socket.io Client v4
- **Notifications**: Sonner Toast
- **Markdown Support**: react-markdown with remark-gfm

### Features & Libraries
- **Date Handling**: date-fns v4
- **Animation**: Framer Motion v11
- **Carousel**: Embla Carousel React
- **UI Kit**: Geist Design System
- **OTP Input**: input-otp v1
- **Theme Switching**: next-themes

### Development & Quality
- **Linting**: ESLint
- **Code Formatting**: Prettier + Tailwind Plugin
- **Pre-commit Hooks**: Husky + Lint-staged
- **Testing**: Jest + React Testing Library
- **Type Checking**: TypeScript strict mode
- **Code Quality**: typescript-eslint

## ⭐ Tính Năng Nổi Bật

- ✅ **Đặt Vé Phim**: Chọn suất chiếu, chọn ghế, thanh toán
- ✅ **Chế Độ AI Booking**: Theo dõi, tư vần quá trình đặt vé, tự động đặt vé theo yêu cầu
- ✅ **Quản Lý Tài Khoản**: Hồ sơ, cài đặt, lịch sử đặt vé
- ✅ **Combo & Menu**: Duyệt và đặt combo, menu
- ✅ **Thanh Toán VNPay**: Thanh toán an toàn
- ✅ **Chat Hỗ Trợ**: Chat real-time với nhân viên
- ✅ **Bình Luận & Đánh Giá**: Tương tác với cộng đồng
- ✅ **Dark Mode**: Hỗ trợ chế độ tối
- ✅ **Responsive Design**: Tối ưu trên mọi thiết bị
- ✅ **Hiệu Suất Cao**: Caching thông minh

## 🚀 Quick Start

```bash
# Cài đặt
cd Client
npm install

# Chạy dev server
npm run dev

# Mở http://localhost:5000
```

## 📝 Các Lệnh Khả Dụng

```bash
npm run dev              # Chạy dev server
npm run build            # Build production
npm start                # Chạy production
npm run lint             # Kiểm tra linting
npm run lint:fix         # Sửa linting issues
npm run format           # Format code
npm run type-check       # Kiểm tra TypeScript
npm test                 # Chạy tests
npm run test:watch       # Tests watch mode
```

## 🔧 Cấu Hình Environment

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_ENABLE_AI_MODE=true
NEXT_PUBLIC_ENABLE_CHAT=true
```

## 📁 Cấu Trúc Thư Mục

```
Client/
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilities
│   ├── store/            # Zustand stores
│   └── types/            # TypeScript types
├── public/               # Static assets
└── package.json          # Dependencies
```

## 📦 Dependencies Chính

- **next** - React framework
- **react** - UI library
- **typescript** - Type system
- **tailwindcss** - Styling
- **zustand** - State management
- **react-query** - Data fetching
- **react-hook-form** - Form handling
- **socket.io-client** - Real-time communication

## 🔐 Security & Best Practices

- TypeScript strict mode
- Zod validation
- JWT token handling
- React auto-escaping
- Environment variables
- Code splitting

## 📄 License

Private - All rights reserved

---

**Version**: 0.1.0  
**Last Updated**: 2026-03-26  
**Node**: 18+  
**Package Manager**: npm/yarn
