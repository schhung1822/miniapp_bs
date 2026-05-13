# Hệ thống Authentication

Hệ thống đăng nhập đã được cài đặt hoàn chỉnh cho ứng dụng CRM.

## 📋 Các tính năng

- ✅ Đăng nhập với username/email và password
- ✅ JWT-based authentication
- ✅ Protected routes với middleware
- ✅ Session management với HTTP-only cookies
- ✅ User context provider
- ✅ Logout functionality
- ✅ Password hashing với bcryptjs

## 🚀 Hướng dẫn cài đặt

### 1. Cập nhật database

```bash
cd crm
npx prisma migrate dev --name add_user_auth
```

### 2. Tạo user demo (optional)

```bash
npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/create-demo-user.ts
```

User demo:

- Username: `admin`
- Password: `admin123`
- Email: `admin@example.com`

### 3. Cấu hình môi trường

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cập nhật các biến môi trường:

- `DATABASE_URL`: Connection string đến database
- `JWT_SECRET`: Secret key để ký JWT (thay đổi trong production)

### 4. Chạy ứng dụng

```bash
npm run dev
```

## 🔐 Cách sử dụng

### Đăng nhập

Truy cập: `http://localhost:3000/auth/v2/login`

### Sử dụng useAuth hook

```tsx
import { useAuth } from "@/components/auth-provider";

function MyComponent() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Thêm UserMenu vào layout

```tsx
import { UserMenu } from "@/components/user-menu";

// Add to your header/navbar
<UserMenu />;
```

### Kiểm tra authentication ở server side

```tsx
import { getCurrentUser } from "@/lib/auth";

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/v2/login");
  }

  return <div>Welcome, {user.name}</div>;
}
```

## 🛡️ Bảo mật

- Password được hash với bcryptjs (10 rounds)
- JWT được lưu trong HTTP-only cookie
- Middleware tự động bảo vệ tất cả routes trừ public routes
- Token hết hạn sau 7 ngày

## 📁 Cấu trúc files

```
src/
├── lib/
│   └── auth.ts                 # Auth utilities
├── middleware.ts               # Route protection
├── components/
│   ├── auth-provider.tsx       # Auth context
│   └── user-menu.tsx           # User dropdown menu
├── app/
│   ├── (public)/
│   │   └── auth/v2/login/
│   │       └── page.tsx        # Login page
│   └── api/
│       └── auth/
│           ├── login/route.ts  # Login API
│           ├── logout/route.ts # Logout API
│           └── me/route.ts     # Get current user
└── prisma/
    └── schema.prisma           # User model
```

## 🔧 Tùy chỉnh

### Thay đổi thời gian hết hạn token

Chỉnh sửa trong `src/lib/auth.ts`:

```typescript
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
```

### Thêm public routes

Chỉnh sửa trong `src/middleware.ts`:

```typescript
const PUBLIC_ROUTES = [
  "/auth/v2/login",
  "/api/auth/login",
  "/your-public-route", // Add here
];
```

## 🐛 Troubleshooting

### Lỗi database connection

Kiểm tra `DATABASE_URL` trong file `.env` đúng format:

```
DATABASE_URL="mysql://user:password@localhost:3306/database_name"
```

### Không redirect sau login

Kiểm tra console browser để xem có lỗi JavaScript không. Đảm bảo đã import AuthProvider trong layout.

### Token không được lưu

Kiểm tra cookie settings trong browser. HTTP-only cookies không thể đọc từ JavaScript.

## 📝 Tạo user mới thủ công

```typescript
import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const hashedPassword = await hashPassword("your-password");

await prisma.user.create({
  data: {
    username: "newuser",
    email: "user@example.com",
    password: hashedPassword,
    name: "New User",
    role: "user",
  },
});
```
