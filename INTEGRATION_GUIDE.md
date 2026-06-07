# Hướng dẫn kết nối Frontend & Backend với Seed Data

## 🚀 Bước 1: Chạy Seed Data (Tạo dữ liệu trường và ngành)

Hãy mở terminal trong thư mục `backend` và chạy lệnh:

```bash
# Kích hoạt virtual environment (nếu chưa kích hoạt)
.venv\Scripts\Activate

# Chạy script seed data
python -m backend.seed_data
```

**Kết quả mong đợi:**
```
✅ Seed data created successfully!
Created 5 universities and populated with majors.
```

Điều này sẽ tạo:
- **5 trường đại học**: ĐH Quốc gia Hà Nội, ĐH Quốc gia TP.HCM, ĐH Bách Khoa, ĐH Kinh tế QD, ĐH FPT
- **18 ngành học** được gắn với các trường

## 🔄 Bước 2: Kiểm tra Backend đang chạy

Đảm bảo backend Uvicorn đang chạy:

```bash
uvicorn backend.main:app --reload
```

✅ Backend chạy tại: http://127.0.0.1:8000

## 🎨 Bước 3: Chạy Frontend

Mở terminal khác trong thư mục `frontend`:

```bash
npm start
```

✅ Frontend chạy tại: http://localhost:8000

## 📱 Bước 4: Xem dữ liệu

### Cách 1: Xem qua trang Universities
Truy cập: http://localhost:8000/universities

Sẽ thấy danh sách 5 trường với các ngành học của mỗi trường được hiển thị đẹp mắt.

### Cách 2: Xem qua API Documentation
Truy cập Swagger UI: http://127.0.0.1:8000/docs

Tại đây có thể:
- ✅ GET /universities - Lấy danh sách trường
- ✅ GET /majors - Lấy danh sách tất cả ngành
- ✅ GET /majors/university/{id} - Lấy ngành theo trường

## 🔗 Quy trình API Integration

### Frontend → Backend Flow:

```
1. Frontend (React) 
   ↓
2. Gọi API qua axios (src/services/university.ts, major.ts)
   ↓
3. Backend nhận request tại /universities, /majors
   ↓
4. Backend query database MySQL
   ↓
5. Trả về JSON response
   ↓
6. Frontend parse và hiển thị
```

### Các endpoint có sẵn:

| Phương thức | Endpoint | Mục đích |
|---|---|---|
| GET | /universities | Lấy danh sách trường |
| POST | /universities | Thêm trường mới |
| GET | /majors | Lấy danh sách ngành |
| GET | /majors/university/{id} | Lấy ngành của trường |
| PUT | /majors/{id} | Cập nhật ngành |
| DELETE | /majors/{id} | Xóa ngành |

## 📋 Các file đã được cập nhật/tạo:

### Backend:
- ✅ `backend/seed_data.py` - Script populate dữ liệu
- ✅ `backend/main.py` - Sửa lỗi duplicate code

### Frontend:
- ✅ `frontend/src/services/university.ts` - Service fetch universities
- ✅ `frontend/src/services/major.ts` - Service fetch majors
- ✅ `frontend/src/pages/Universities/index.tsx` - Trang hiển thị trường & ngành
- ✅ `frontend/src/pages/Universities/index.css` - Style cho trang
- ✅ `frontend/src/app.tsx` - Thêm routing rules cho trang universities

## ✨ Tính năng đã có sẵn:

1. **Lấy dữ liệu từ Database**: Tất cả universities và majors được lưu trong MySQL
2. **API Integration**: Frontend gọi backend API để lấy dữ liệu
3. **Automatic Routing**: Umi.js tự động tạo route từ file structure
4. **Responsive Design**: Trang hiển thị đẹp trên desktop, tablet, mobile
5. **Loading State**: Hiển thị spinner khi đang tải dữ liệu
6. **Error Handling**: Xử lý lỗi và hiển thị message

## 🧪 Test Integration:

### Test 1: Kiểm tra API trực tiếp
```bash
# Terminal
curl http://127.0.0.1:8000/universities
curl http://127.0.0.1:8000/majors
```

### Test 2: Kiểm tra Frontend
- Truy cập http://localhost:8000/universities
- Kiểm tra Console (F12) để xem logs
- Xác nhận dữ liệu hiển thị đúng

## 🐛 Troubleshooting:

**Q: Lỗi "GET /universities 404 Not Found"**
A: Kiểm tra backend đang chạy tại port 8000

**Q: Frontend không hiển thị dữ liệu**
A: Mở F12 → Console tab → kiểm tra error messages từ API

**Q: CORS errors**
A: Backend đã cấu hình CORS cho tất cả origins, nên không nên xảy ra

**Q: Seed data không tạo được**
A: Kiểm tra MySQL đang chạy và database `admission_system` tồn tại

## 📚 Tiếp theo:

Bây giờ bạn có thể:
1. ✅ Xem danh sách trường & ngành
2. ⏳ Implement chức năng nộp đơn (đã có endpoint /applications)
3. ⏳ Implement chức năng admin dashboard
4. ⏳ Implement chức năng filter & search

Happy coding! 🎉
