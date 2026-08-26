# 📋 Trello Web Application (React.js + Vite)

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-4.3.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/MUI-Material--UI-007FFF?style=for-the-badge&logo=mui&logoColor=white" alt="Material UI" />
  <img src="https://img.shields.io/badge/Redux--Toolkit-2.0.1-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux Toolkit" />
  <img src="https://img.shields.io/badge/Socket.io-4.8.3-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io" />
  <img src="https://img.shields.io/badge/Node-%3E%3D18.x-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node" />
</p>

Ứng dụng quản lý công việc và dự án theo mô hình Kanban Board (tương tự **Trello**), được xây dựng với **React 18**, **Vite**, **Material UI (MUI)**, **@dnd-kit** và **Socket.io**. Hỗ trợ đầy đủ tính năng kéo thả mượt mà, cập nhật dữ liệu thời gian thực (Real-time), phân quyền, quản lý thành viên, bình luận, và hệ thống bảo mật xác thực tiên tiến.

---

## 🚀 Tính năng nổi bật

### 1. 🗂️ Quản lý Bảng (Board), Cột (Column) & Thẻ (Card)
- **Kéo thả mượt mà (@dnd-kit)**:
  - Kéo thả sắp xếp thứ tự các Column trong Board.
  - Kéo thả sắp xếp Card trong cùng một Column.
  - Kéo thả di chuyển Card giữa các Column khác nhau với thuật toán xử lý va chạm tối ưu.
- **Thao tác nhanh**:
  - Tạo mới, chỉnh sửa tiêu đề, xóa Column và Card.
  - Hỗ trợ Card rỗng (Placeholder Card) khi Column chưa có dữ liệu.

### 2. 📝 Chi tiết Thẻ (Active Card Modal)
- Chỉnh sửa tiêu đề và mô tả Card với trình soạn thảo Markdown (`@uiw/react-md-editor`).
- Tải lên / thay đổi ảnh bìa (Cover Image) cho Card.
- Thêm / xóa thành viên tham gia xử lý công việc trong Card.
- Hệ thống bình luận (Comments) và theo dõi hoạt động theo thời gian thực.

### 3. ⚡ Real-time Collaboration (Socket.io)
- Đồng bộ tức thì trạng thái kéo thả Column, Card giữa nhiều người dùng trên cùng một Board.
- Nhận thông báo mời tham gia Board và lời mời cộng tác theo thời gian thực.

### 4. 🔐 Xác thực & Phân quyền (Authentication & Authorization)
- Đăng ký, đăng nhập tài khoản và xác thực email kích hoạt (`/account/verification`).
- **Clean Architecture & Security**:
  - Quản lý token an toàn qua **HttpOnly Cookie** từ Backend.
  - **Axios Interceptors** tự động can thiệp request/response.
  - Cơ chế **Auto Refresh Token** (mã `410 GONE`) thông minh, tránh gọi lặp request và tự động retry sau khi làm mới token.
  - Xử lý chặn spam click khi gửi request API.
- Điều hướng bảo vệ trang: `ProtectedRoute` và `PublicRoute`.

### 5. 👥 Quản lý người dùng & Cài đặt (User & Settings)
- Cập nhật thông tin cá nhân (Avatar, Display Name, Bio,...).
- Đổi mật khẩu và cài đặt bảo mật tài khoản.
- Quản lý danh sách thành viên trong Board.

### 6. 🎨 Giao diện & Trải nghiệm (UI/UX)
- Giao diện hiện đại, tinh gọn chuẩn Material Design với **Material UI**.
- Chế độ giao diện Sáng / Tối / Tự động theo hệ thống (**Light / Dark / System Mode**).
- Thông báo Toast trực quan với **React-Toastify**.
- Hộp thoại xác nhận tùy biến với **material-ui-confirm**.

---

## 🛠️ Công nghệ sử dụng

| Công nghệ / Thư viện | Phiên bản | Mục đích sử dụng |
| :--- | :--- | :--- |
| **React** | `^18.2.0` | Thư viện xây dựng giao diện người dùng |
| **Vite** | `^4.3.2` | Build tool và Development Server tốc độ cao |
| **Material UI (MUI)** | `^7.3.1` | Thư viện UI Components & Theme Styling |
| **@dnd-kit** | `^6.0.8` | Bộ công cụ Drag & Drop hiệu năng cao cho React |
| **Redux Toolkit & Persist** | `^2.0.1` | Quản lý state tập trung (User, ActiveBoard, Notifications,...) |
| **React Router DOM** | `^6.21.3` | Quản lý định tuyến và phân quyền Route |
| **Axios** | `^1.18.1` | HTTP Client xử lý gọi API & Interceptors |
| **Socket.io-client** | `^4.8.3` | Kết nối WebSocket nhận & gửi sự kiện Real-time |
| **React Hook Form** | `^7.49.3` | Xử lý Form và validation hiệu quả |
| **@uiw/react-md-editor** | `^4.0.3` | Trình soạn thảo Markdown cho mô tả Card |
| **React Toastify** | `^11.1.0` | Hiển thị thông báo trạng thái ứng dụng |

---

## 📁 Cấu trúc thư mục (Project Structure)

```text
trello-web/
├── public/                 # Static assets (favicons, logos, ...)
├── src/
│   ├── apis/               # Cấu hình Axios instance, interceptors và các hàm gọi API
│   │   ├── config.js       # Axios instance, Interceptor logic, Refresh token handler
│   │   ├── index.js        # API endpoints (Boards, Columns, Cards, Users, ...)
│   │   └── mock-data.js    # Dữ liệu mẫu phục vụ phát triển / testing
│   ├── assets/             # Hình ảnh, icons, SVGs
│   ├── components/         # Các React Components dùng chung
│   │   ├── Appbar/         # Thanh điều hướng trên cùng (Search, Notifications, Profile,...)
│   │   ├── Form/           # FieldErrorAlert, Form inputs
│   │   ├── Loading/        # Loading Spinner / Page Loading
│   │   ├── Modal/          # ActiveCard Modal (Chi tiết thẻ, bình luận, markdown,...)
│   │   └── ModeSelect/     # Component chọn chế độ Light/Dark Theme
│   ├── customHooks/        # Custom React Hooks
│   ├── pages/              # Các trang chính của ứng dụng
│   │   ├── 404/            # Trang 404 Not Found
│   │   ├── Auth/           # Trang Login, Register, Account Verification
│   │   ├── Boards/         # Danh sách Boards & Chi tiết Board (/boards/:boardId)
│   │   │   ├── BoardBar/   # Thanh thông tin & hành động của Board
│   │   │   └── BoardContent/ # Khu vực kéo thả Column và Card (dnd-kit)
│   │   ├── Settings/       # Trang cài đặt tài khoản & bảo mật
│   │   └── Users/          # Quản lý người dùng
│   ├── redux/              # Redux Toolkit Slices & Store configuration
│   │   ├── activeBoard/    # State & Reducers của Board hiện tại
│   │   ├── activeCard/     # State & Reducers của Card đang mở Modal
│   │   ├── notifications/  # Quản lý thông báo người dùng
│   │   ├── user/           # Quản lý thông tin & phiên đăng nhập của User
│   │   └── store.js        # Cấu hình Redux Store kết hợp Redux Persist
│   ├── utils/              # Utilities, formatters, validators, constants
│   ├── App.jsx             # Định tuyến chính (Protected / Public routes)
│   ├── main.jsx            # Entry point của ứng dụng React (CssVarsProvider, Redux, Toast)
│   ├── socketClient.js     # Khởi tạo kết nối Socket.io Client
│   └── theme.js            # Tùy biến bảng màu và theme Material UI
├── .env                    # Biến môi trường
├── index.html              # HTML template
├── package.json            # Thông tin dependencies và scripts
└── vite.config.js          # Cấu hình Vite & path aliases (~/ -> src/)
```

---

## ⚙️ Yêu cầu môi trường

- **Node.js**: `>= 18.x`
- **npm** hoặc **yarn**

---

## 🔧 Hướng dẫn cài đặt & Chạy ứng dụng

### 1. Clone dự án và truy cập thư mục

```bash
git clone <repository-url>
cd trello-web
```

### 2. Cài đặt các thư viện (Dependencies)

Sử dụng `npm`:
```bash
npm install
```
Hoặc sử dụng `yarn`:
```bash
yarn install
```

### 3. Cấu hình biến môi trường (`.env`)

Tạo file `.env` tại thư mục gốc của dự án và cấu hình địa chỉ API Backend:

```env
# Địa chỉ API khi deploy Production
VITE_URL_PRODUC=https://trello-api-ieln.onrender.com
```

> **Lưu ý:** Khi chạy ở chế độ Development (`npm run dev`), hệ thống tự động trỏ đến `http://localhost:3000` (hoặc cổng Backend cục bộ). Khi build Production, hệ thống sẽ sử dụng giá trị từ `VITE_URL_PRODUC`.

### 4. Khởi chạy Development Server

```bash
npm run dev
```
Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:5173` (hoặc địa chỉ hiển thị trên terminal).

---

## 📜 Các lệnh Scripts có sẵn

| Lệnh | Mô tả |
| :--- | :--- |
| `npm run dev` | Khởi chạy môi trường phát triển (Development Mode) với Hot Module Replacement |
| `npm run build` | Đóng gói ứng dụng cho môi trường Production vào thư mục `dist/` |
| `npm run preview` | Chạy thử bản build Production ở môi trường local |
| `npm run lint` | Kiểm tra lỗi cú pháp và format code bằng ESLint |

---

## 🌟 Điểm nổi bật về Kiến trúc & Kỹ thuật

- **Store Injection**: Kỹ thuật đưa Redux Store vào file cấu hình Axios (`config.js`) để dispatch các actions (như logout, refresh token) ngoài phạm vi React Components mà không gây circular dependency.
- **Tối ưu kéo thả với dnd-kit**: Sử dụng Sensors, Collision Detection Strategy kết hợp xử lý state bất đồng bộ giúp việc kéo thả giữa các column mượt mà và chính xác.
- **Xử lý bất đồng bộ & Retry Request**: Khi Access Token hết hạn (mã `410`), Axios Interceptor kích hoạt `refreshTokenPromise` để làm mới token và tự động thực thi lại các request bị gián đoạn mà người dùng không bị văng khỏi trang.

---

## 👨‍💻 Tác giả

- **Tác giả**: [Ngô Tuấn Việt](https://github.com/ngotuanviet)
- **Dự án**: Trello Clone MERN Stack (Frontend Client)
