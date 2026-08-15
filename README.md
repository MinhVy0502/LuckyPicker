# 🌟 LuckyPicker & TeamCraft PRO

Ứng dụng Web hiện đại, đa năng giúp **Quay tên ngẫu nhiên**, **Vòng quay may mắn**, **Phân chia đội nhóm thông minh**, **Ghép đôi & Bốc thăm quà bí mật (Secret Santa)** và các **Minigame tiện ích** sống động.

---

## ✨ Tính Năng Nổi Bật

### 1. 👥 Phân Chia Team Thông Minh (Smart Team Generator)
- **Tùy biến linh hoạt:** Chia theo **Số lượng đội** hoặc **Số người mỗi đội**.
- **Tự động đặt tên đội vui nhộn:** Chủ đề Siêu Anh Hùng, Đá Quý & Kim Cương, Thần Thoại, Thiên Hà, Trái Cây, Bảng Màu, v.v.
- **Chỉ định Đội Trưởng ngẫu nhiên:** Gán huy hiệu 👑 vinh danh.
- **Kéo & Thả (Drag & Drop):** Tự do điều chỉnh, hoán đổi thành viên giữa các đội.
- **Xuất dữ liệu 1-Click:**
  - Sao chép văn bản định dạng đẹp để gửi vào Zalo, Slack, Messenger, Discord.
  - Tải ảnh kết quả đội nhóm chất lượng cao về máy.

### 2. 🎡 Vòng Quay May Mắn (Lucky Spin Wheel)
- Render Canvas HTML5 mượt mà với hiệu ứng xoay và lực ma sát vật lý chân thực.
- Kim chỉ gõ nhịp (tick sound), pháo hoa Confetti rực rỡ và âm thanh ăn mừng khi có người trúng giải.
- Tự động lưu lịch sử trúng thưởng và tùy chọn loại trừ người đã trúng.
- Hỗ trợ phím tắt **Spacebar** để quay nhanh.

### 3. 🎰 Máy Quay Số Xèng (Slot Machine Casino)
- Hiệu ứng cuộn tên kịch tính phong cách casino.
- Hỗ trợ quay nhiều người trúng cùng lúc (1, 2, 3 hoặc 5 giải).

### 4. 🃏 Lật Thẻ Bài Bí Mật (Mystery Blind Box)
- Hiệu ứng lật thẻ 3D hồi hộp, mở từng thẻ hoặc lật mở hàng loạt hiệu ứng domino.

### 5. 🎁 Ghép Đôi & Bốc Thăm Quà Bí Mật (Secret Santa)
- **Ghép đôi 1-1:** Bắt cặp làm việc nhóm, học tập, mentor - mentee.
- **Secret Santa:** Vòng tròn trao quà khép kín không ai tự bốc trúng mình, bảo mật danh tính người nhận đến khi nhấn mở.

### 6. 🎲 Minigame Tiện Ích Tích Hợp
- 🪙 **Tung Đồng Xu 3D:** Hiệu ứng quay xu sấp/ngửa kèm âm thanh kim loại chân thực.
- 🎲 **Lắc Xúc Xắc 3D:** Tùy chọn 1 - 4 viên xúc xắc, tự tính tổng điểm.
- 🔢 **Rút Số Ngẫu Nhiên (RNG Min-Max):** Bốc số may mắn trong khoảng tùy chọn.

### 7. 🎨 Giao Diện & Trải Nghiệm (UX/UI Premium)
- Phong cách **Glassmorphism**, hiệu ứng Neon Glow hiện đại.
- Chuyển đổi **Dark Mode / Light Mode**.
- Bộ tạo âm thanh **Web Audio API** tích hợp sẵn (không cần tải file MP3 ngoài).
- Lưu trữ danh sách mẫu tùy biến vào **LocalStorage**.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Trực Tiếp

Ứng dụng được xây dựng hoàn toàn bằng HTML5, CSS3 và Vanilla ES6 JavaScript chuẩn hiện đại. **Không cần cài đặt phức tạp hay build tool nặng nề**.

### Cách 1: Mở trực tiếp trên trình duyệt
Chỉ cần nhấp đúp vào file `index.html` hoặc kéo thả vào bất kỳ trình duyệt nào (Chrome, Edge, Safari, Firefox).

### Cách 2: Chạy qua Live Server / HTTP Server
```bash
# Sử dụng Python
python -m http.server 8080

# Hoặc sử dụng Node.js npx
npx serve
```
Truy cập: `http://localhost:8080`

---

## 📁 Cấu Trúc Dự Án

```
AppRandom/
├── index.html            # Giao diện chính đa tab & modal
├── css/
│   └── style.css         # Hệ thống Design Tokens, Glassmorphism, Dark/Light theme, Animations
├── js/
│   ├── app.js            # Điều phối toàn bộ sự kiện ứng dụng & tương tác UI
│   ├── audio.js          # Bộ phát âm thanh Web Audio API tổng hợp
│   ├── storage.js        # Quản lý danh sách, Preset mẫu & LocalStorage
│   ├── teams.js          # Thuật toán chia team, đặt tên, kéo thả & xuất ảnh
│   ├── wheel.js          # Engine vòng quay may mắn Canvas HTML5
│   ├── slot.js           # Engine máy quay xèng slot machine
│   ├── cards.js          # Engine thẻ bài bí ẩn, ghép đôi & Secret Santa
│   └── tools.js          # Engine tung đồng xu, đổ xúc xắc & RNG
├── .gitignore
└── README.md
```

---

## 📄 Bản Quyền
Dự án mã nguồn mở - Tự do sử dụng và tùy biến theo nhu cầu!
