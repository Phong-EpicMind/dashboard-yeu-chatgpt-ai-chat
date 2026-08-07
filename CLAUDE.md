# CLAUDE.md — Dashboard group Facebook "Yêu ChatGPT & AI Chất"

Web tĩnh (HTML/CSS/JS thuần, không build tool) hiển thị số liệu group Facebook cho khán giả/học viên xem công khai.

## Đọc trước khi sửa bất cứ gì

1. [CONTEXT.md](CONTEXT.md) — từ điển thuật ngữ, giới hạn dữ liệu, và mục "Hướng thiết kế giao diện" (rất quan trọng — giải thích vì sao trang trông thế này).
2. [NGHIEN-CUU-KHA-THI.md](NGHIEN-CUU-KHA-THI.md) — vì sao không dùng được Facebook Graph API (Meta khai tử Groups API từ 22/04/2024) → lý do dữ liệu phải xuất thủ công.
3. `docs/adr/` — 3 quyết định thiết kế: 0001 (công thức Mindshare tự chế), 0002 (cách chia kỳ so sánh, không có 7D/14D/30D thật), 0003 (cách gắn nhãn chủ đề bằng từ khóa).

## Chạy thử

```bash
cd "Dashboard group facebook Yêu ChatGPT & AI Chất"
python3 -m http.server 8000
```
Mở `http://localhost:8000`. **Không double-click index.html** — fetch CSV sẽ bị chặn CORS ở chế độ file://.

## Kiến trúc

- `data-parser.js` — parse `Facebook_Group_Insights_*.csv` (5 bảng gộp 1 file, phân biệt bằng nội dung ô đầu header, không hardcode số dòng) + các hàm tính (mindshare, so kỳ trước, ngày cao/thấp điểm, hiệu suất nội dung). Test nhanh bằng Node: `node -e "require('./data-parser.js')"`.
- `topics.json` — danh sách chủ đề + số lần khớp, tạo bằng cách rà từ khóa thủ công trên nội dung Top Posts (xem ADR 0003). Phải làm lại tay nếu thay CSV mới.
- `index.html` + `style.css` — toàn bộ UI, không framework.

## Nguồn dữ liệu — quan trọng nhất cần nhớ

**Không có API tự động.** Quy trình: Phong tự vào Facebook (Group > Manage > Insights), xuất CSV thủ công, đặt file vào thư mục này (tên có ngày, vd `Facebook_Group_Insights_8-07-2026.csv`), sửa hằng số `CSV_FILE` đầu file `index.html` nếu tên file đổi.

## Hướng thiết kế (đừng vô tình quay lại)

Dashboard lấy Ý TƯỞNG tham khảo từ dashboard cộng đồng "Nghiện AI" nhưng **chủ đích tránh giống họ về thị giác** (Phong sợ bị hiểu nhầm là sao chép khi đăng công khai cho học viên xem). Cụ thể đã đổi:
- Treemap ô vuông → **leaderboard thanh ngang**
- Word cloud → **danh sách kiểu `grep` output**
- Tab bấm chuyển "Người/Chủ đề" → **2 khối hiện song song luôn**, không tab
- Bảng màu cam/trắng kiểu Nghiện AI → **nền tối + JetBrains Mono + chrome cửa sổ terminal** (3 chấm đỏ/vàng/xanh), lấy từ chính trang cá nhân thật của Phong: https://ai-agent-vibe-coding-02.pages.dev/

Nếu sửa UI sau này: **đừng thêm lại treemap, word cloud, hoặc tab chuyển view** — những cái đó đã bị bỏ có chủ đích, không phải quên làm.

## Quy tắc chính xác (đã áp dụng, giữ nguyên)

Mọi số liệu **tự tính** (không phải Facebook cho sẵn) phải có chú thích "ⓘ" + tooltip nói rõ, không được trình bày như số liệu chính thức: % Mindshare (ADR 0001), % so kỳ trước (ADR 0002), nhãn Chủ đề (ADR 0003), Hiệu suất nội dung (views/bài). Chú thích dài không được in nguyên văn lên UI (trang công khai cho học viên xem) — chỉ để trong tooltip/title attribute, chi tiết đầy đủ nằm ở CONTEXT.md/ADR.
