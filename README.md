# 🇻🇳 Khám Phá Địa Điểm Du Lịch Việt Nam (Vietnam Tourism Platform)

Hệ thống ứng dụng web quản lý và khám phá địa điểm du lịch Việt Nam được thiết kế và triển khai theo kiến trúc **Microservices**, đóng gói toàn bộ dịch vụ thông qua **Docker Compose**.

---

## 📌 Lưu ý quan trọng: File cấu hình môi trường (`.env`)

> [!IMPORTANT]
> **🔐 LƯU Ý BẢO MẬT VỀ FILE MÔI TRƯỜNG (`.env`)**
> 
> Hệ thống tích hợp các dịch vụ bên ngoài như **Google Gemini AI API**, **Google OAuth 2.0**, **Hệ thống gửi mã OTP qua Gmail SMTP** và **JWT Secret Key**.
> 
> Vì lý do bảo mật, file `.env` chứa các khóa bí mật thực tế **KHÔNG ĐƯỢC ĐƯA LÊN GITHUB**.
> 
> 👉 **Vui lòng nhắn tin / liên hệ trực tiếp cho tôi (chủ sở hữu repo) để lấy file `.env` chuẩn đã cấu hình sẵn đầy đủ khóa chạy được ngay!**
> 
> Hoặc bạn có thể sao chép từ file mẫu [`.env.example`](.env.example) và tự điền các thông tin của riêng bạn:
> ```bash
> cp .env.example .env
> ```

---

## 🏛️ Kiến Trúc Hệ Thống (Microservices Architecture)

Dự án được phân tách thành các dịch vụ độc lập:

| Service | Công nghệ / Nền tảng | Cổng nội bộ | Mô tả nhiệm vụ |
| :--- | :--- | :--- | :--- |
| **API Gateway** | Nginx Reverse Proxy | `8080` (Host: 8080 -> 80) | Cổng giao tiếp trung tâm, định tuyến request và cân bằng tải giữa Frontend & các Services |
| **Frontend** | React 18, Vite, Lucide Icons | `80` | Giao diện người dùng hiện đại, responsive, hỗ trợ đăng nhập Google OAuth, tìm kiếm & đánh giá |
| **Province Service** | Node.js, Express, MySQL | `3001` | Quản lý danh mục 63 tỉnh/thành phố, diện tích, dân số, thông tin vùng miền |
| **Location Service** | Node.js, Express, MySQL | `3002` | Quản lý danh sách địa điểm du lịch, hình ảnh, bài đánh giá, duyệt bài đăng |
| **Media Service** | Node.js, Express | `3003` | Xử lý tải lên và phân phối tài nguyên hình ảnh đa phương tiện |
| **AI Service** | Node.js, Express, Google Gemini AI | `3004` | Chatbot tư vấn lịch trình, gợi ý điểm đến và giải đáp du lịch thông minh |
| **User Service** | Node.js, Express, JWT, Bcrypt | `3005` | Xác thực người dùng, phân quyền (User/Admin), xác minh tài khoản qua OTP Email, Google Login |
| **Database** | MySQL | `3306` | Lưu trữ cơ sở dữ liệu hệ thống, khởi tạo tự động bằng `db/init.sql` |

---

## 📁 Cấu Trúc Thư Mục

```text
web/
├── .env.example               # Mẫu biến môi trường
├── .gitignore                 # Danh sách file bỏ qua khi commit (loại trừ .env)
├── docker-compose.yml         # File điều phối khởi chạy toàn bộ hệ thống
├── README.md                  # Tài liệu hướng dẫn dự án
├── api-gateway/               # Cấu hình Nginx API Gateway & Dockerfile
├── frontend/                  # Mã nguồn ứng dụng React + Vite
├── province-service/          # Microservice quản lý tỉnh thành
├── location-service/          # Microservice quản lý địa điểm
├── media-service/             # Microservice upload và lưu trữ media
├── ai-service/                # Microservice tích hợp Gemini AI
├── user-service/              # Microservice xác thực và quản lý tài khoản
└── db/
    └── init.sql               # Script khởi tạo cơ sở dữ liệu mẫu
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Yêu cầu tiên quyết
- [Docker](https://www.docker.com/) và **Docker Compose** đã được cài đặt trên máy.
- File `.env` đặt tại thư mục gốc `web/` (nhắn cho tôi để nhận file hoặc tự cấu hình theo `.env.example`).
- MySQL Server cục bộ (hoặc khởi chạy qua Docker) tương ứng cấu hình trong `docker-compose.yml`.

### 2. Khởi chạy toàn bộ hệ thống với Docker Compose

1. **Clone repository về máy:**
   ```bash
   git clone https://github.com/ngocanh2610/webdulich-mcs.git
   cd webdulich-mcs
   ```

2. **Chuẩn bị file môi trường:**
   - Dán file `.env` nhận được vào thư mục dự án (hoặc tạo từ `.env.example`).

3. **Khởi tạo cơ sở dữ liệu:**
   - Import file `db/init.sql` vào cơ sở dữ liệu MySQL của bạn (Database: `vntourism`).

4. **Build và khởi động toàn bộ containers:**
   ```bash
   docker-compose up --build -d
   ```

5. **Kiểm tra trạng thái các container:**
   ```bash
   docker-compose ps
   ```

6. **Truy cập ứng dụng:**
   - Mở trình duyệt và truy cập: **`http://localhost:8080`**

---

## 🔑 Tài Khoản Quản Trị Mặc Định

Sau khi import cơ sở dữ liệu từ file `db/init.sql`, hệ thống có sẵn tài khoản quản trị:

- **Username:** `admin`
- **Email:** `admin@vietnamtourism.vn`
- **Role:** `admin`

---

## 👥 Tác Giả & Hỗ Trợ

Nếu bạn gặp khó khăn khi cài đặt, cần hỗ trợ thêm thông tin hoặc muốn nhận file `.env`, vui lòng:
- Nhắn tin trực tiếp qua GitHub: [@ngocanh2610](https://github.com/ngocanh2610)
- Hoặc tạo một **Issue** trong repository này.
