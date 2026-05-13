# Cập nhật sử dụng bảng `template` hiện có

## ✅ Đã thay đổi

Đã cập nhật hệ thống để sử dụng bảng `template` hiện có trong database của bạn:

### 1. Prisma Schema (prisma/schema.prisma)

```prisma
model FormTemplate {
  id_temp     String   @id @default(uuid())
  slug        String   @unique
  name        String
  isActive    String   @default("1")
  configJson  String   @db.LongText
  create_time DateTime @default(now())
  update_time DateTime @updatedAt

  @@map("template")
}
```

### 2. Repository Functions (src/lib/form-template/repo.ts)

- `getTemplateBySlug()`: Parse JSON từ string và convert isActive ("1"/"0") sang boolean
- `upsertTemplate()`: Stringify config thành JSON string
- `ensureDefaultTemplate()`: Tạo template mặc định với isActive = "1"

## 🔧 Các bước tiếp theo

### 1. Restart VS Code hoặc đóng tất cả terminal/dev server

Hiện có nhiều process Node đang chạy làm khóa file Prisma. Sau khi restart:

```bash
cd crm
npx prisma generate
```

### 2. Kiểm tra kết nối database

Đảm bảo file `.env` có DATABASE_URL đúng:

```env
DATABASE_URL="mysql://user:password@103.97.126.211:3306/EAC"
```

### 3. Test template

```bash
cd crm
npm run dev
```

Truy cập:

- Admin: `http://localhost:3000/admin/templates/eac-checkin`
- Public: `http://localhost:3000/t/eac-checkin`

## 📋 Mapping Fields

| Bảng template | Prisma Model | TypeScript Type  |
| ------------- | ------------ | ---------------- |
| id_temp       | id_temp      | string (UUID)    |
| slug          | slug         | string           |
| name          | name         | string           |
| isActive      | isActive     | string ("1"/"0") |
| configJson    | configJson   | string (JSON)    |
| create_time   | create_time  | DateTime         |
| update_time   | update_time  | DateTime         |

## ⚠️ Lưu ý

1. **isActive** là string ("1" = active, "0" = inactive), không phải boolean
2. **configJson** được lưu dưới dạng LONGTEXT, code sẽ tự động parse/stringify
3. **id_temp** sử dụng UUID thay vì auto-increment integer
4. Không cần chạy migration vì bảng đã tồn tại

## 🧪 Test Query SQL

Kiểm tra template trong database:

```sql
SELECT id_temp, slug, name, isActive,
       LEFT(configJson, 100) as config_preview,
       create_time, update_time
FROM template
WHERE slug = 'eac-checkin';
```

Insert template mẫu nếu chưa có:

```sql
INSERT INTO template (id_temp, slug, name, isActive, configJson)
VALUES (
  UUID(),
  'eac-checkin',
  'EAC Check-in',
  '1',
  '{"webhookUrl":"https://nextg.nextgency.vn/webhook/EAC-dang-ky","theme":{"bg":"#fde7f1","card":"rgba(255,255,255,.92)","primary":"#ec5fa4","primary2":"#f7a1c4","text":"#7a2b4b","muted":"#b06a8c","ring":"rgba(236,95,164,.35)"},"fields":{"full_name":{"enabled":true,"required":true,"label":"Họ và tên","placeholder":"VD: Nguyễn Văn A"},"phone":{"enabled":true,"required":true,"label":"Số điện thoại","placeholder":"VD: 0912345678"},"email":{"enabled":true,"required":false,"label":"Email","placeholder":"VD: abc@email.com"},"hidden":{"user_id":{"enabled":true},"city":{"enabled":true},"role":{"enabled":true},"clinic":{"enabled":true},"full_name_nv":{"enabled":true}}},"questions":[]}'
)
ON DUPLICATE KEY UPDATE name = VALUES(name);
```
