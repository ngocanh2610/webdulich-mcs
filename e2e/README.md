# Bộ Kiểm Thử Tự Động Playwright (E2E & Microservices API)

Thư mục này chứa bộ kiểm thử tự động **End-to-End (E2E) trên trình duyệt thật** kết hợp **kiểm thử tích hợp API** cho toàn bộ hệ thống Microservices Du Lịch Việt Nam.

## 1. Cấu trúc bài kiểm thử (`tests/`)

- `01-api-microservices.spec.js`: Kiểm thử API Gateway (`/health`, CORS), `province-service` (63 tỉnh & 34 tỉnh sáp nhập, ánh xạ slug tỉnh cũ), `location-service`, `media-service` (tải ảnh & chặn file độc hại), `user-service` (chặn JWT giả mạo & RBAC) và `ai-service`.
- `02-public-ui-provinces.spec.js`: Kiểm thử giao diện Trang chủ, kiểm tra lỗi JS Console / ảnh vỡ, chuyển đổi 63 ⇄ 34 tỉnh trên thanh điều hướng, tự động chuyển hướng trang tỉnh đã sáp nhập (`/provinces/ha-nam` -> `/provinces/ninh-binh`) và trang chi tiết địa điểm.
- `03-ai-assistants.spec.js`: Kiểm thử 2 trợ lý AI trên giao diện thật (`ChatWidget` góc phải và trang lập lịch trình `/planner`, kiểm tra chống tự cuộn trang và tạo link chia sẻ).
- `04-auth-post-admin.spec.js`: Kiểm thử giao diện `/auth` (Đăng nhập / Đăng ký / Quên mật khẩu), chặn khách vào `/admin/approvals`, và luồng E2E khép kín: **User đăng nhập gửi bài chờ duyệt -> Admin duyệt bài trên UI -> Thông báo, thả tim, bình luận & tự dọn dữ liệu**.

## 2. Chạy trên GitHub Actions CI/CD

Bộ kiểm thử chạy **hoàn toàn tự động** trong file `.github/workflows/deploy.yml`:
1. Khi `push` lên nhánh `ngocanh` hoặc `main` (hoặc tạo Pull Request), GitHub Actions tự dựng toàn bộ Docker Compose + MySQL, nạp tài khoản kiểm thử và chạy 14 kịch bản Playwright bằng trình duyệt Chromium headless.
2. Sau mỗi lần chạy, báo cáo giao diện đồ họa `playwright-report` được đính kèm tại mục **Artifacts** trên GitHub Actions.
3. Chỉ khi Job **`Playwright E2E & API Tests`** đạt **100% PASS**, Job **`Deploy to AWS EC2`** mới được phép cập nhật code lên server `https://ngoccanhh2610.id.vn`.

## 3. Chạy thử trên máy cá nhân (Local)

```bash
cd e2e
npm install
npx playwright install chromium

# Chạy kiểm thử mặc định (http://localhost:2222)
npm test

# Mở giao diện trực quan của Playwright để xem từng bước bấm chuột
npm run test:ui

# Xem báo cáo HTML sau khi chạy
npm run test:report
```
