# Contributing Guidelines

Cảm ơn bạn đã quan tâm đến việc đóng góp cho project! 🎉

## Quy Trình Đóng Góp

### 1. Fork & Clone
```bash
# Fork repo trên GitHub
# Clone về máy local
git clone https://github.com/your-username/modern-nextjs-project.git
cd modern-nextjs-project
```

### 2. Tạo Branch Mới
```bash
# Tạo branch từ main
git checkout -b feature/your-feature-name
# hoặc
git checkout -b fix/your-bug-fix
```

### 3. Setup Development Environment
```bash
# Cài dependencies
npm install

# Setup git hooks
npm run prepare

# Chạy dev server
npm run dev
```

### 4. Coding Standards

#### Code Style
- Sử dụng TypeScript strict mode
- Follow ESLint rules
- Format code với Prettier (tự động khi commit)
- Viết meaningful commit messages

#### Component Guidelines
```tsx
// ✅ Good - Functional component với types
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// ❌ Bad - No types, class component
class Button extends Component {
  render() {
    return <button>{this.props.label}</button>;
  }
}
```

#### File Naming
- Components: PascalCase - `Button.tsx`, `UserProfile.tsx`
- Utilities: camelCase - `formatDate.ts`, `apiClient.ts`
- Types: PascalCase - `User.ts`, `ApiResponse.ts`

### 5. Testing
```bash
# Chạy tests
npm run test

# Type checking
npm run type-check

# Linting
npm run lint
```

### 6. Commit Guidelines

Sử dụng Conventional Commits:

```bash
# Features
git commit -m "feat: add user authentication"

# Bug fixes
git commit -m "fix: resolve login redirect issue"

# Documentation
git commit -m "docs: update README with setup instructions"

# Styles
git commit -m "style: format code with prettier"

# Refactoring
git commit -m "refactor: simplify auth logic"

# Performance
git commit -m "perf: optimize image loading"

# Tests
git commit -m "test: add tests for user service"
```

### 7. Push & Pull Request
```bash
# Push branch
git push origin feature/your-feature-name

# Tạo Pull Request trên GitHub
# - Mô tả chi tiết thay đổi
# - Reference issues nếu có
# - Thêm screenshots nếu có UI changes
```

## Pull Request Checklist

- [ ] Code follows project style guide
- [ ] Tests pass (`npm run test`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Documentation updated (nếu cần)
- [ ] Commit messages follow convention
- [ ] No console.logs or debugging code
- [ ] Responsive design tested (nếu có UI changes)
- [ ] Accessibility considered

## Code Review Process

1. Maintainer sẽ review code
2. Có thể yêu cầu thay đổi
3. Sau khi approved, PR sẽ được merge
4. Branch sẽ được xóa sau khi merge

## Reporting Bugs

### Bug Report Template
```markdown
**Mô tả bug:**
Mô tả ngắn gọn về bug

**Các bước tái tạo:**
1. Vào trang '...'
2. Click vào '...'
3. Scroll xuống '...'
4. Thấy lỗi

**Kết quả mong đợi:**
Mô tả điều bạn mong đợi xảy ra

**Kết quả thực tế:**
Mô tả điều thực sự xảy ra

**Screenshots:**
Thêm screenshots nếu có

**Môi trường:**
- OS: [e.g. macOS, Windows]
- Browser: [e.g. Chrome 120]
- Node version: [e.g. 20.10.0]
```

## Feature Requests

### Feature Request Template
```markdown
**Mô tả feature:**
Mô tả chi tiết feature mong muốn

**Lý do:**
Tại sao feature này hữu ích?

**Giải pháp đề xuất:**
Mô tả cách implement (optional)

**Alternatives:**
Các phương án khác đã xem xét (optional)
```

## Development Tips

### Hot Reload Issues
```bash
# Clear cache
rm -rf .next
npm run dev
```

### Debugging
```tsx
// Use React DevTools
// Use Next.js DevTools
// Use console.log wisely (remember to remove)
```

### Performance
```tsx
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // ...
});

// Use dynamic imports for code splitting
const HeavyComponent = dynamic(() => import('./HeavyComponent'));
```

## Questions?

Nếu có câu hỏi:
- Mở GitHub Issue
- Tag maintainers
- Hỏi trên Discord/Slack (nếu có)

## License

Bằng việc đóng góp, bạn đồng ý rằng contributions của bạn sẽ được license dưới cùng license với project.

---

Thank you for contributing! 🚀
