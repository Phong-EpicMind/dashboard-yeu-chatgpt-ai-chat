# Handoff — Dashboard group Facebook "Yêu ChatGPT & AI Chất"

Cập nhật: 07/08/2026. Session trước dừng ở đây để tiết kiệm token — đọc file này trước khi tiếp tục.

## Trạng thái: bản demo chạy được, Phong đã duyệt hướng thiết kế

Dashboard tĩnh (`index.html`) đọc `Facebook_Group_Insights_8-07-2026.csv`, hiển thị:
- Leaderboard top 10 Contributor (thanh ngang, xếp theo % Mindshare tự tính)
- Danh sách Chủ đề kiểu `grep` output (14 chủ đề, rà từ khóa thủ công từ `topics.json`)
- Log kiểm duyệt admin (`tail -f moderation.log` style)
- Panel ngày cao điểm / thấp điểm / hiệu suất nội dung
- Card bài nổi bật (spotlight) + biểu đồ nhịp hoạt động theo Thứ
- 4 thẻ số liệu tổng quan (thành viên mới, lượt xem, bài viết, tương tác) kèm sparkline ASCII cho 2 thẻ

Đã kiểm bằng browser thật (Playwright/Claude Browser), số liệu khớp với `data-parser.js` đã test qua Node.

## Đã đổi qua nhiều vòng phản hồi của Phong (đọc để không làm lại)

1. Bản đầu style "giấy kem doodle" sáng màu → **Phong không thích, đòi tông dark/terminal đúng cá tính anh** (tham khảo https://ai-agent-vibe-coding-02.pages.dev/).
2. Treemap + word cloud (giống hệt Nghiện AI về thị giác) → đổi sang leaderboard thanh ngang + grep-style list.
3. Tab "Người/Chủ đề" bấm chuyển (vẫn giống pattern Nghiện AI dù đổi nội dung) → bỏ tab, cho hiện song song 2 cột.
4. Đoạn giải thích dài về cách tính Mindshare/Chủ đề in thẳng lên UI → dời vào tooltip + file ADR riêng (trang này công khai cho học viên xem, không phải nội bộ).
5. Dùng `mattpocock-skills:frontend-design` để thêm chrome cửa sổ terminal (chữ ký thị giác) + 3 khối dữ liệu mới (sparkline, peak/quiet day, hiệu suất nội dung).

## Việc CÒN DANG DỞ / chưa làm

- **"Chuỗi phong độ"** — ý tưởng gác lại: trích nguyên văn 1 câu nổi bật từ nội dung Top Posts (vd narrative "Lan Huong 6 tuần liên tiếp Top 2" mà admin tự viết trong bài AI Power Ranking hàng tuần) để làm caption phụ cho leaderboard. Chưa làm vì cần đọc tay để trích đúng, tự động hoá dễ trích sai/gán nhầm người — rủi ro theo quy tắc chính xác của Phong. Nếu làm: đọc trực tiếp cột `title` trong `data.topPosts` (qua `data-parser.js`), KHÔNG suy diễn/viết lại câu, chỉ trích nguyên văn.
- **Deploy** — ĐÃ XONG (07/08/2026). Git repo private tại [github.com/Phong-EpicMind/dashboard-yeu-chatgpt-ai-chat](https://github.com/Phong-EpicMind/dashboard-yeu-chatgpt-ai-chat), deploy công khai (không Access) tại https://dashboard-yeu-chatgpt-ai-chat.pages.dev.
  - **QUAN TRỌNG: chỉ deploy thư mục `public/`, KHÔNG deploy `.` (thư mục gốc)** — rà bảo mật phát hiện deploy `.` từng đẩy công khai cả CLAUDE.md/handoff.md/CONTEXT.md/ADR lên trang public. Lệnh đúng: `wrangler pages deploy public --project-name=dashboard-yeu-chatgpt-ai-chat`.
  - Khi cập nhật CSV mới hoặc sửa `index.html`/`style.css`/`data-parser.js`/`topics.json`: sửa ở bản gốc (thư mục ngoài) rồi copy đè vào `public/` trước khi deploy lại, hoặc sửa thẳng trong `public/` — nhớ đồng bộ 2 nơi nếu sửa ở ngoài.
- **Cập nhật dữ liệu định kỳ** — Phong nói "chỉ thử 1 lần xem có dựng được không đã" (chưa xác nhận có xuất CSV mới định kỳ hay không). Nếu có CSV mới: đổi hằng số `CSV_FILE` trong `index.html`, và **phải rà lại `topics.json` bằng tay** (không tự động, xem ADR 0003).

## Nếu Phong quay lại hỏi "làm tiếp đi"

Hỏi Phong chọn 1 trong 3 hướng còn treo: (a) làm "chuỗi phong độ", (b) deploy lên Cloudflare Pages, (c) việc khác. Đừng tự chọn thay — cả 3 đều chưa được Phong xác nhận ưu tiên.

## File quan trọng cần đọc trước khi code

`CLAUDE.md` (thư mục này) → `CONTEXT.md` → `docs/adr/000{1,2,3}-*.md` → rồi mới đọc `index.html`/`data-parser.js`.
