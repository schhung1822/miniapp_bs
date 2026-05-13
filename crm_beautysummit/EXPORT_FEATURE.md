# Hướng dẫn sử dụng chức năng xuất dữ liệu

## Tổng quan

Chức năng xuất dữ liệu đã được tích hợp vào các bảng trong hệ thống CRM, cho phép bạn xuất dữ liệu ra file Excel (.xlsx) hoặc CSV (.csv) với các tùy chọn lọc theo thời gian.

## Các bảng đã tích hợp

Chức năng xuất đã được thêm vào các bảng sau:
- ✅ **Events** (Sự kiện)
- ✅ **Orders** (Đơn hàng)
- ✅ **Customers** (Khách hàng)
- ✅ **Products** (Sản phẩm)

## Cách sử dụng

### 1. Mở dialog xuất dữ liệu

Nhấn vào nút **"Xuất"** ở góc trên bên phải của bảng dữ liệu.

### 2. Chọn định dạng file

Chọn một trong hai định dạng:

- **Excel (.xlsx)**
  - Phù hợp để mở bằng Microsoft Excel, Google Sheets
  - Hỗ trợ format tốt hơn
  - Tự động điều chỉnh độ rộng cột

- **CSV (.csv)**
  - Định dạng văn bản đơn giản
  - Tương thích với mọi phần mềm
  - Kích thước file nhẹ hơn

### 3. Lọc theo thời gian (tùy chọn)

Bạn có thể lọc dữ liệu theo khoảng thời gian:

1. Nhấn vào **"Từ ngày"** để chọn ngày bắt đầu
2. Nhấn vào **"Đến ngày"** để chọn ngày kết thúc
3. Để xóa bộ lọc, nhấn **"Xóa bộ lọc"**

**Lưu ý:** Nếu không chọn thời gian, hệ thống sẽ xuất toàn bộ dữ liệu hiện có trên bảng (đã áp dụng bộ lọc hiện tại).

### 4. Xuất dữ liệu

Nhấn nút **"Xuất dữ liệu"** để bắt đầu quá trình xuất.

File sẽ tự động tải xuống với tên dạng: `[tên-bảng]_[ngày].xlsx` hoặc `.csv`

Ví dụ: `orders_2026-01-23.xlsx`

## Các tính năng bổ sung

### Bộ lọc sự kiện (Events)

Bảng Events có thêm tùy chọn lọc theo tên sự kiện. Dữ liệu xuất sẽ bao gồm các sự kiện đã được lọc.

### Tìm kiếm

Dữ liệu xuất sẽ tuân theo kết quả tìm kiếm hiện tại. Nếu bạn đã tìm kiếm trước khi xuất, chỉ các kết quả phù hợp sẽ được xuất ra.

### Headers tiếng Việt

Tất cả các cột trong file xuất đều có tiêu đề tiếng Việt dễ hiểu:
- Mã đơn hàng
- Tên khách hàng
- Số điện thoại
- Địa chỉ
- v.v.

### Format dữ liệu

- **Ngày tháng**: Định dạng dd/MM/yyyy HH:mm
- **Số tiền**: Giữ nguyên format số
- **Văn bản**: UTF-8 encoding, hiển thị đúng tiếng Việt

## Xử lý lỗi

Nếu gặp lỗi trong quá trình xuất:
1. Kiểm tra kết nối internet
2. Đảm bảo trình duyệt cho phép tải xuống
3. Thử xuất lại với ít dữ liệu hơn

## Thư viện sử dụng

- **xlsx**: Tạo file Excel
- **papaparse**: Tạo file CSV
- **date-fns**: Format ngày tháng

## Cấu trúc code

```
crm/src/
├── components/ui/
│   └── export-dialog.tsx        # Dialog UI cho xuất dữ liệu
├── lib/
│   └── export-utils.ts          # Utility functions
└── app/(main)/
    ├── events/_components/
    │   └── data-table.tsx       # Bảng Events
    ├── orders/_components/
    │   └── data-table.tsx       # Bảng Orders
    ├── customers/_components/
    │   └── data-table.tsx       # Bảng Customers
    └── products/_components/
        └── data-table.tsx       # Bảng Products
```

## Mở rộng

Để thêm chức năng xuất cho bảng mới:

1. Import các dependencies cần thiết
2. Thêm state cho dialog
3. Tạo handleExport function với headers phù hợp
4. Thêm ExportDialog component vào JSX

Xem code trong các file data-table.tsx để tham khảo.
