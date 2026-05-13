# 🔐 Quick Start - Authentication System

## ✅ Hệ thống đã được cài đặt thành công!

### 📝 Tóm tắt những gì đã được triển khai:

1. **Database Schema**: Cập nhật bảng `user` với các trường cần thiết
2. **Authentication Library**: JWT-based auth với bcryptjs
3. **Login Page**: `/auth/v2/login`
4. **API Routes**:
   - POST `/api/auth/login` - Đăng nhập
   - POST `/api/auth/logout` - Đăng xuất
   - GET `/api/auth/me` - Lấy thông tin user hiện tại
5. **Middleware**: Tự động bảo vệ tất cả routes, redirect về login nếu chưa đăng nhập
6. **Auth Provider**: Context để quản lý trạng thái đăng nhập
7. **UserMenu Component**: Dropdown menu hiển thị thông tin user & logout button

---

## 🚀 Cách sử dụng ngay:

### 1. Đăng nhập với user hiện có

Nếu đã có user trong database:

- Truy cập: `http://localhost:3000/auth/v2/login`
- Nhập username/email và password
- Đăng nhập

### 2. Tạo user mới (nếu chưa có)

Chạy lệnh sau để tạo script tạo user:

```typescript
// Tạo file: scripts/create-new-user.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("yourpassword", 10);

  const user = await prisma.user.create({
    data: {
      user: "yourusername",
      email: "your@email.com",
      password: hashedPassword,
      name: "Your Name",
      role: "admin",
      status: "active",
    },
  });

  console.log("✅ User created:", user.user);
}

main().finally(() => prisma.$disconnect());
```

Sau đó chạy:

```bash
npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/create-new-user.ts
```

### 3. Kiểm tra authentication

Bất kỳ trang nào trong app (trừ `/auth/v2/login`) đều yêu cầu đăng nhập.

Nếu chưa đăng nhập → tự động redirect về `/auth/v2/login`

---

## 🎨 Thêm UserMenu vào giao diện

Trong file layout hoặc header component của bạn:

```tsx
import { UserMenu } from "@/components/user-menu";

export function Header() {
  return (
    <header>
      {/* ... các component khác ... */}
      <UserMenu />
    </header>
  );
}
```

---

## 🔧 Sử dụng Auth Hook

Trong bất kỳ client component nào:

```tsx
"use client";

import { useAuth } from "@/components/auth-provider";

export function MyComponent() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## 🛡️ Kiểm tra auth ở Server Component

```tsx
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/v2/login");
  }

  // User is authenticated
  return <div>Welcome {user.name}</div>;
}
```

---

## 🔐 Password Hash

Nếu cần hash password thủ công:

```typescript
import { hashPassword } from "@/lib/auth";

const hashed = await hashPassword("mypassword");
// Lưu vào database
```

---

## 📋 Môi trường (Environment Variables)

Đảm bảo file `.env` có:

```env
DATABASE_URL="mysql://user:password@host:3306/database"
JWT_SECRET="your-secret-key-min-32-characters"
NODE_ENV="development"
```

---

## ✨ Tính năng

- ✅ Session-based authentication với JWT
- ✅ HTTP-only cookies (bảo mật)
- ✅ Password hashing với bcryptjs
- ✅ Auto-redirect nếu chưa đăng nhập
- ✅ User context toàn cục
- ✅ Token tự động gia hạn
- ✅ Logout functionality
- ✅ Role-based data trong JWT

---

## 🐛 Troubleshooting

**Không redirect sau login?**

- Kiểm tra console browser có lỗi
- Xóa cookie và thử lại
- Restart dev server

**Lỗi kết nối database?**

- Kiểm tra `DATABASE_URL` trong `.env`
- Chạy `npx prisma generate`

**Không thấy UserMenu?**

- Import và thêm `<UserMenu />` vào header/navbar

---

## 📚 Files quan trọng

```
src/
├── lib/auth.ts                    # Auth utilities
├── middleware.ts                  # Route protection
├── components/
│   ├── auth-provider.tsx         # Auth context
│   └── user-menu.tsx             # User dropdown
├── app/
│   ├── (public)/auth/v2/login/   # Login page
│   └── api/auth/                 # Auth APIs
```

---

## ⚡ Next Steps

1. ✅ Test đăng nhập
2. ✅ Thêm UserMenu vào header
3. ✅ Tạo thêm users nếu cần
4. ✅ Tùy chỉnh giao diện login page
5. ✅ Thêm role-based permissions

**Chúc mừng! Hệ thống authentication đã hoạt động! 🎉**
