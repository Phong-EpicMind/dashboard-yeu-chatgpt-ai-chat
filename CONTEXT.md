# CONTEXT — Dashboard group Facebook "Yêu ChatGPT & AI Chất"

Glossary cho domain của dashboard. Không chứa chi tiết implementation.

## Nguồn dữ liệu

**Group Insights Export** — file CSV Phong tự xuất thủ công từ giao diện quản trị group Facebook (Manage > Insights), đặt vào thư mục dự án theo tên có ngày xuất (vd `Facebook_Group_Insights_8-07-2026.csv`). Đây là nguồn dữ liệu duy nhất của dashboard — không có API tự động (xem [NGHIEN-CUU-KHA-THI.md](NGHIEN-CUU-KHA-THI.md)).

Một file export gộp **5 bảng con** không có dòng phân cách rõ ràng — phân biệt bằng nội dung ô đầu dòng header của mỗi bảng, không phải bằng số dòng cố định (số dòng đổi mỗi lần export vì số Top Posts/Top Contributors thay đổi).

## Glossary

- **Kỳ báo cáo (Reporting Period)** — khoảng ngày liên tục trong bảng theo-ngày của Group Insights (vd 29 ngày). Không phải "7D/14D/30D" cố định như dashboard Nghiện AI — độ dài kỳ phụ thuộc hoàn toàn vào khoảng ngày Phong chọn lúc xuất file trên Facebook.
- **Ngày-Insight (Daily Insight)** — một dòng trong bảng theo-ngày: số thành viên mới (`Joined`), số người có đăng/bình luận (`Posted or Commented`), lượt xem (`Viewed`), số bài đăng (`Posts`), số bình luận (`Comments`), số reaction (`Reactions`) của đúng ngày đó. Đây là số liệu gốc Facebook cung cấp, không suy diễn thêm.
- **Nhịp hoạt động theo Thứ (Weekday Activity)** — tổng một chỉ số hoạt động (Facebook không ghi rõ chỉ số nào — chỉ ghi cột "Value") theo từng Thứ trong tuần, cộng dồn suốt kỳ báo cáo. Vì Facebook không nêu rõ đây là tổng của chỉ số gì (không phải Posts, không phải Comments riêng lẻ — số lớn hơn cả hai cộng lại ở một số hàng), **không được tự đặt tên/suy diễn ý nghĩa cột "Value" này** — hiển thị nguyên văn là "hoạt động theo thứ" và ghi chú "theo số liệu Facebook cung cấp, chưa rõ định nghĩa chính xác".
- **Khung giờ vàng đã chọn (Selected Popular-Time Slot)** — Group Insights UI của Facebook chỉ xuất được **một khung giờ tại một thời điểm** (ở file mẫu là "12 AM"), không phải toàn bộ 24 khung giờ. Đây là giới hạn của thao tác export thủ công (UI chỉ xuất khung giờ đang được chọn trên màn hình), **không phải dữ liệu đầy đủ cho một heatmap 24 giờ**. Dashboard không được vẽ heatmap đầy đủ nếu chỉ có 1 khung giờ trong file — phải hiển thị đúng như một điểm dữ liệu duy nhất, hoặc bỏ qua phần này ở bản đầu.
- **Bài nổi bật (Top Post)** — một bài đăng trong group nằm trong danh sách "Top Posts" Facebook chọn sẵn (không rõ tiêu chí xếp hạng của Facebook — không suy diễn là "top theo view" hay "top theo reaction", chỉ hiển thị nguyên bảng Facebook trả về). Có tiêu đề/nội dung trích đoạn, tác giả (`Member`), Comments, Reactions, Views, Link.
- **Người đóng góp (Contributor)** — một thành viên trong bảng "Top Contributors" của Facebook, kèm số Posts, Comments, Likes cộng dồn trong kỳ báo cáo. Facebook đã tự chọn danh sách này (không phải toàn bộ thành viên group) — dashboard không được nói "tất cả thành viên", phải nói "top contributor theo Facebook".
- **Điểm Mindshare (Mindshare Score)** — **KHÔNG phải số Facebook cung cấp sẵn**. Đây là chỉ số tự tính của dashboard, dùng để xếp hạng Contributor trong leaderboard. Vì là số tự tính, mọi nơi hiển thị phải ghi chú rõ "cách tính nội bộ", không trình bày như số liệu chính thức của Facebook. Công thức cụ thể là quyết định thiết kế — xem ADR 0001.
- **Admin Duyệt Bài (Admin Moderation)** — bảng riêng liệt kê từng admin group với số bài đã duyệt/từ chối/xoá, số thành viên đã duyệt/từ chối. Không liên quan đến Contributor hay Mindshare.
- **Ngày cao điểm / thấp điểm (Peak / Quiet Day)** — ngày có Lượt xem cao nhất/thấp nhất trong Ngày-Insight của kỳ báo cáo. Chỉ so trong đúng số ngày có trong file hiện tại, không suy rộng ra "cao điểm mọi thời điểm".
- **Hiệu suất nội dung (Content Efficiency)** — Lượt xem ÷ số Bài đăng, tính riêng cho nửa kỳ này và nửa kỳ trước (cùng cách chia ở ADR 0002). Là số tự tính, không phải Facebook cung cấp — đo "trung bình một bài được xem bao nhiêu", khác với tổng Lượt xem thô.

## Ghi chú giới hạn dữ liệu quan trọng

Facebook không cung cấp: member count tổng (chỉ có số **thành viên mới** theo ngày, không có tổng số thành viên hiện tại của group trong file này), không có breakdown theo chủ đề nội dung (danh sách Chủ đề phải tự rà từ text bài đăng bằng từ khóa, không phải số Facebook đưa sẵn — xem ADR 0003), không có % thay đổi so kỳ trước (dashboard phải tự tính, xem ADR 0002).

## Hướng thiết kế giao diện

Dashboard tham khảo Ý TƯỞNG (không tham khảo hình thức) từ một dashboard cộng đồng khác tên Nghiện AI. Phong yêu cầu rõ: **không được giống họ về mặt thị giác**, để tránh bị hiểu nhầm là sao chép khi đăng công khai. Ngôn ngữ thị giác đã chốt: nền tối gần đen, font monospace (JetBrains Mono) cho số liệu/nhãn, palette cam/cyan/tím/xanh lá — lấy từ trang cá nhân thật của Phong (ai-agent-vibe-coding-02.pages.dev), không phải màu tự chọn. Chữ ký thị giác (signature): mọi panel dữ liệu đóng khung như cửa sổ terminal (3 chấm đỏ/vàng/xanh + tên lệnh/file), nhại đúng khối code trên trang cá nhân của Phong. Bảng xếp hạng Contributor trình bày dạng leaderboard thanh ngang (không phải treemap ô vuông) và danh sách Chủ đề trình bày dạng output `grep` (không phải word cloud) — đây là lựa chọn có chủ đích để khác hẳn Nghiện AI, không phải ngẫu nhiên.
