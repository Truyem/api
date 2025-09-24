# API Data Fetcher 🚀

Hệ thống tự động lấy dữ liệu từ API và lưu vào file JSON.

## 📋 Tổng quan

Script này sẽ tự động fetch dữ liệu từ các endpoint API sau:
- **Health Check**: `/api/health` → `health.json`
- **Bảng xếp hạng**: `/api/leaderboards` → `leaderboards.json`
- **Danh sách người chơi**: `/api/players` → `players.json`
- **Danh sách kỹ năng**: `/api/skills` → `skills.json`

**Base URL**: `http://103.161.119.206:25087`

## 🔧 Cài đặt

### 1. Cài đặt Node.js
Đảm bảo bạn đã cài đặt Node.js (phiên bản 14.0.0 trở lên):
```bash
node --version
```

### 2. Cài đặt dependencies
```bash
npm install
```

## 🚀 Cách sử dụng

### Chạy một lần
```bash
# Sử dụng npm script
npm run fetch

# Hoặc chạy trực tiếp
node fetchData.js
```

### Chạy tự động (mỗi 1 phút)
```bash
# Sử dụng npm script
npm run auto

# Hoặc chạy trực tiếp với flag --auto
node fetchData.js --auto
```

### Sử dụng file chạy sẵn (Windows)
```bash
# Double-click để chạy
run.bat
```

### Sử dụng file chạy sẵn (Linux/Mac)
```bash
# Cấp quyền thực thi và chạy
chmod +x run.sh
./run.sh
```

## 🤖 Workflow Automation

### 1. GitHub Actions (Recommended)
Script sẽ tự động chạy mỗi phút trên GitHub và commit dữ liệu mới:

- ✅ **Tự động**: Chạy mỗi phút thông qua GitHub Actions
- ✅ **Version Control**: Tự động commit và push thay đổi
- ✅ **Backup**: Upload artifacts cho mỗi lần chạy
- ✅ **Monitoring**: Có thể xem logs và history trên GitHub

**Cách kích hoạt:**
1. Push code lên GitHub repository
2. GitHub Actions sẽ tự động chạy workflow
3. Có thể chạy manual từ GitHub Actions tab

### 2. Windows Task Scheduler
Tạo scheduled task để chạy tự động trên máy Windows:

```powershell
# Chạy PowerShell as Administrator
.\setup-scheduler.ps1

# Hoặc sử dụng file batch (dễ hơn)
.\setup-task.bat
```

**Tính năng:**
- ✅ Chạy mỗi phút ngay cả khi không có internet
- ✅ Chạy trong background
- ✅ Có thể cấu hình trigger tùy chỉnh
- ✅ Logs chi tiết trong Task Scheduler

### 3. Linux/Mac Cron Job
Thêm vào crontab để chạy tự động:

```bash
# Mở crontab editor
crontab -e

# Thêm dòng này để chạy mỗi phút
* * * * * cd /path/to/api && node fetchData.js --auto
```

### 4. Docker (Advanced)
Chạy trong Docker container:

```dockerfile
# Tạo Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "fetchData.js", "--auto"]
```

```bash
# Build và chạy
docker build -t api-fetcher .
docker run -d --restart=always api-fetcher
```

## 📁 Cấu trúc file

Sau khi chạy, bạn sẽ có các file sau:
- `health.json` - Thông tin health check
- `leaderboards.json` - Dữ liệu bảng xếp hạng
- `players.json` - Danh sách người chơi
- `skills.json` - Danh sách kỹ năng
- `{name}_error.json` - File lỗi (nếu có)

## ⚙️ Tùy chỉnh

### Thay đổi Base URL
Mở file `fetchData.js` và sửa đổi biến `BASE_URL`:
```javascript
const BASE_URL = 'http://103.161.119.206:25087'; // Thay đổi ở đây
```

### Thay đổi thời gian tự động
Trong file `fetchData.js`, tìm và sửa đổi:
```javascript
const runEvery = (minutes) => {
    fetchData();
    setTimeout(() => runEvery(minutes), minutes * 60 * 1000);
};

runEvery(1); // Thay đổi 1 thành số phút mong muốn
```

### Cấu hình GitHub Actions Workflow
Trong file `.github/workflows/auto-fetch-data.yml`:
- **Thay đổi schedule**: Sửa cron expression để chạy theo thời gian mong muốn
- **Thay đổi Node.js version**: Cập nhật `node-version` trong workflow
- **Tắt auto-commit**: Xóa hoặc comment phần "Commit and push changes"

### Thêm endpoint mới
Trong file `fetchData.js`, thêm vào object `endpoints`:
```javascript
const endpoints = {
    health: '/api/health',
    leaderboards: '/api/leaderboards',
    players: '/api/players',
    skills: '/api/skills',
    newEndpoint: '/api/new-endpoint' // Thêm endpoint mới
};
```

## 🔍 Monitoring & Debug

### Kiểm tra log
Script sẽ hiển thị log chi tiết trong console:
- ✅ Thành công: Hiển thị kích thước file
- ❌ Lỗi: Ghi thông tin lỗi vào file `{name}_error.json`

### Kiểm tra file kết quả
```bash
# Xem nội dung file JSON
cat health.json

# Kiểm tra lỗi (nếu có)
cat health_error.json
```

## 📊 Scripts có sẵn

| Script | Mô tả |
|--------|--------|
| `npm run fetch` | Chạy một lần |
| `npm run auto` | Chạy tự động mỗi 1 phút |
| `npm run start` | Alias cho `npm run fetch` |
| `npm run test` | Alias cho `npm run fetch` |

## 🛠️ Troubleshooting

### Lỗi "Node.js is not installed"
- Tải và cài đặt Node.js từ [nodejs.org](https://nodejs.org)
- Khởi động lại terminal/command prompt

### Lỗi "Failed to install dependencies"
- Xóa thư mục `node_modules`
- Chạy lại `npm install`

### Lỗi kết nối API
- Kiểm tra kết nối internet
- Đảm bảo API server đang chạy tại `http://103.161.119.206:25087`
- Kiểm tra file `{name}_error.json` để xem thông tin lỗi chi tiết

### Timeout errors
- Script có timeout 10 giây cho mỗi request
- Nếu API phản hồi chậm, có thể tăng timeout trong file `fetchData.js`

## 📝 Logs mẫu

```
🚀 Bắt đầu fetch dữ liệu từ API...
📍 Base URL: http://103.161.119.206:25087
📡 Đang lấy dữ liệu từ: http://103.161.119.206:25087/api/health
✅ Đã lưu thành công health.json (42 ký tự)
📡 Đang lấy dữ liệu từ: http://103.161.119.206:25087/api/leaderboards
✅ Đã lưu thành công leaderboards.json (1234 ký tự)
🎉 Hoàn thành quá trình fetch dữ liệu!
```

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request.

## 📄 Giấy phép

MIT License - xem file LICENSE để biết thêm chi tiết.
