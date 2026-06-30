# Hướng Dẫn Build / Đóng Gói (ASAR Pack) Cho ATP Software Patched

Tài liệu này hướng dẫn cách áp dụng code vá lỗi và đóng gói lại các ứng dụng Electron của ATP Software (như Simple Chat Pro, Simple Tikdown V2) bằng công cụ `asar`.

---

## 1. Yêu Cầu Hệ Thống

Trước khi thực hiện, máy tính cần cài đặt sẵn:
- **Node.js** (Phiên bản khuyên dùng `>= 16.x`)
- Thư viện đóng gói **asar** được cài đặt global qua npm:
  ```powershell
  npm install -g asar
  ```

---

## 2. Các Bước Thực Hiện Cho Simple Tikdown V2

Do Simple Tikdown V2 lưu trữ code trong file `app.asar`, bạn cần thực hiện giải nén, copy code vá lỗi và đóng gói lại theo quy trình sau:

### Bước 1: Sao lưu file asar gốc
Đến thư mục `resources` trong thư mục cài đặt phần mềm và đổi tên file `app.asar` thành `app.asar.bak`:
- Đường dẫn mặc định: `D:\Program Files\ATP Software\Simple Tikdown V2\resources`

### Bước 2: Giải nén file asar
Mở PowerShell/CMD dưới quyền **Administrator**, chuyển đến thư mục chứa file asar và chạy lệnh:
```powershell
asar extract app.asar.bak app_temp
```
*Lệnh này sẽ tạo thư mục `app_temp` chứa toàn bộ mã nguồn frontend và backend của ứng dụng.*

### Bước 3: Áp dụng code vá lỗi
Sao chép file `main.js` đã được vá từ thư mục dự án phát triển ghi đè vào thư mục tạm vừa giải nén:
- File nguồn: `d:\Dev\Projects\ATP Software\Simple Tikdown V2\resources\app\app\main.js`
- Đường dẫn đích ghi đè: `app_temp\app\main.js`

### Bước 4: Đóng gói lại file asar
Chạy lệnh sau để build/repack thư mục tạm thành file `app.asar` chính thức:
```powershell
asar pack app_temp app.asar
```

### Bước 5: Dọn dẹp
Xóa thư mục tạm `app_temp` để giải phóng ổ cứng:
```powershell
rmdir /S /Q app_temp
```

---

## 3. Các Bước Thực Hiện Cho Simple Chat Pro

Simple Chat Pro không sử dụng đóng gói asar mà chạy code trực tiếp dưới dạng thư mục phẳng.
Quy trình áp dụng đơn giản hơn:
1. Sao chép trực tiếp file project nguồn đã vá:
   - Nguồn: `d:\Dev\Projects\ATP Software\Simple Chat Pro\resources\app\electron\dist\main.js`
2. Ghi đè vào thư mục cài đặt thực tế (yêu cầu quyền Admin):
   - Đích: `D:\Program Files\ATP Software\Simple Chat Pro\resources\app\electron\dist\main.js`

---

## 4. Công Cụ Hỗ Trợ Tự Động (Batch Scripts)

Bạn có thể tìm thấy các file script `.bat` hỗ trợ tự động hóa các tác vụ trên tại thư mục dự án hoặc folder scratch:
- [copy_main.bat](file:///C:/Users/ADMIN/.gemini/antigravity/brain/c03aa052-9f0c-486e-9db3-3ac6ae858e71/scratch/copy_main.bat): Tự động copy và đè file main.js cho Simple Chat Pro.
- [patch_tikdown_asar.bat](file:///C:/Users/ADMIN/.gemini/antigravity/brain/c03aa052-9f0c-486e-9db3-3ac6ae858e71/scratch/patch_tikdown_asar.bat): Tự động giải nén, đè main.js và repack app.asar cho Simple Tikdown V2.
