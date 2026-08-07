# Nghiên cứu khả thi kỹ thuật: Dashboard theo dõi group "Yêu ChatGPT & AI Chất"

Ngày tra cứu: 2026-08-07. Nguồn ưu tiên: developers.facebook.com (chính thức Meta), facebook.com/legal.

## 1. Facebook Graph API / Groups API cho group admin lấy được gì?

**Groups API đã bị Meta khai tử, không phải "hạn chế" mà là gỡ bỏ hoàn toàn.** Theo đúng changelog chính thức của Graph API v19.0: thông báo phát hành ngày 23/01/2024, "Applies to v19.0. Will apply to all versions from April 22, 2024" - Meta gỡ bỏ permission `publish_to_groups`, `groups_access_member_info`, và toàn bộ Groups API khỏi mọi phiên bản kể từ 22/04/2024. Đồng thời Meta cũng dừng luôn khả năng admin nhóm cài app vào group (Group's App tab) "even if they have an admin or developer role in the app" ([Graph API Changelog v19.0](https://developers.facebook.com/docs/graph-api/changelog/version19.0)).

Hệ quả trực tiếp cho dự án này:
- **Không còn cách nào qua Graph API để lấy** member list, số thành viên theo thời gian, danh sách bài đăng trong group, reaction/comment/share theo từng bài, hay "views" của group/bài viết trong group - vì các endpoint và permission phục vụ việc này đã bị gỡ.
- Trang tham chiếu chính thức [Groups API - Features Reference](https://developers.facebook.com/docs/features-reference/groups-api/) hiện chỉ còn nói về việc các permission/tính năng này đã bị deprecate, không còn mô tả cách dùng như trước.
- Cách kiểm chứng Meta gợi ý: gửi thử request tới endpoint ở version 19 để xác nhận có bị chặn permission hay không.

Do đó câu hỏi "permission cần thiết cụ thể, có cần App Review không, rate limit, group phải loại nào" **không còn áp dụng được** - vì API không còn tồn tại cho use case member/post/insight của group thông thường (không phải Workplace). Riêng `/group` node (đọc thông tin cơ bản công khai của group) và `/user/groups` (liệt kê group user quản trị) vẫn còn trong Graph API reference, nhưng không cấp dữ liệu member list/post/insight chi tiết như dashboard cần ([Graph API Reference - Group](https://developers.facebook.com/docs/graph-api/reference/group/)).

## 2. Nếu Graph API không đủ, phương án thay thế nào?

**Meta Business Suite Insights:** không hỗ trợ lên lịch đăng bài cho Group (chỉ Page), đây là điều nhiều nguồn thứ cấp xác nhận thống nhất; tuy nhiên phần Insights cho Group vẫn hiển thị được khi vào từ chính giao diện Group. Đây là thông tin lấy từ các bài hướng dẫn thứ cấp (Sprout Social, Metricool...), **chưa xác minh được tận trang trợ giúp gốc facebook.com/help nêu rõ phạm vi Business Suite hỗ trợ Group tới đâu** - cần Phong tự vào Business Suite kiểm tra trực tiếp nếu muốn chắc chắn.

**Group Insights/Overview riêng cho admin (trong app/web):** Facebook có tab "Overview"/"Insights" dành cho admin ngay trong giao diện quản trị Group (Group > Manage > Insights hoặc Overview), chia theo Growth (tăng trưởng thành viên), Engagement (bài đăng/bình luận/reaction theo thời gian), Membership (top contributor, dữ liệu nhân khẩu học cơ bản). Đây là mô tả tổng hợp từ nhiều nguồn thứ cấp (Social Media Examiner, Group Leads...), **không phải trang facebook.com/help gốc** - Phong nên tự vào group Yêu ChatGPT & AI Chất, mục Manage > Insights, để xác nhận chính xác các số liệu hiện có, vì giao diện Facebook hay đổi theo thời gian và theo khu vực. Đây là con đường thực tế nhất còn lại để admin xem dữ liệu group, nhưng dữ liệu này **không có API chính thức để lấy tự động** - chỉ xem được thủ công trên UI.

**Automation/browser-scraping bằng tài khoản cá nhân:** Điều khoản dịch vụ chính thức của Meta (facebook.com/legal/terms) nêu rõ: "Bạn không được truy cập hoặc thu thập dữ liệu từ Sản phẩm của chúng tôi bằng các phương tiện tự động (khi chưa được chúng tôi cho phép trước)" và "bất kể việc truy cập hoặc thu thập tự động đó có được thực hiện khi đăng nhập vào tài khoản Facebook hay không" ([Điều khoản dịch vụ Facebook](https://www.facebook.com/legal/terms)). Nói cách khác: dùng Playwright/browser tự động đăng nhập tài khoản cá nhân để đọc dữ liệu group là **vi phạm trực tiếp điều khoản**, không phụ thuộc việc có đăng nhập hay không. Rủi ro thực tế: khóa tài khoản Facebook cá nhân (và cả quyền admin group gắn với tài khoản đó) - Meta có riêng đội "External Data Misuse" chuyên phát hiện scraping ([About Meta - How We Combat Scraping](https://about.fb.com/news/2021/04/how-we-combat-scraping/), nguồn thứ cấp tổng hợp, nội dung đội EDM chưa tự xác minh tới bài gốc).

## 3. Treemap "mindshare" và word cloud của Nghiện AI lấy dữ liệu từ đâu (suy luận có giới hạn)

Không có quyền truy cập nội bộ Nghiện AI nên **không khẳng định** cách họ làm. Các khả năng kỹ thuật hợp lý:

- **Admin tự vào Group Insights UI, copy/export số liệu thủ công** rồi đưa qua LLM để phân loại chủ đề (word cloud) và tính điểm đóng góp theo bài/reaction (treemap). Khả thi cao nhất về mặt tuân thủ điều khoản, nhưng tốn công thủ công, khó tự động hóa theo lịch.
- **Dùng tool scraping bên thứ ba (Apify, PhantomBuster, Bright Data...) đọc dữ liệu group công khai (public group).** Về mặt kỹ thuật khả thi nếu group ở chế độ Public, nhưng vẫn nằm trong phạm vi "phương tiện tự động chưa được Meta cho phép" theo điều khoản trên - rủi ro pháp lý/khóa tài khoản nằm ở phía nhà cung cấp scraping và ở chính tài khoản dùng để cấu hình, chưa kể group Yêu ChatGPT & AI Chất có thể là Private (không rõ, cần Phong xác nhận loại group).
- **Nhập liệu thủ công định kỳ** (đọc trực tiếp trên group, ghi số liệu vào bảng) rồi dashboard chỉ hiển thị dữ liệu đã nhập - an toàn tuyệt đối về điều khoản, nhưng không real-time và tốn công vận hành.

## Bảng tóm tắt phương án

| Phương án | Khả thi kỹ thuật | Tuân thủ ToS Meta | Rủi ro chính |
|---|---|---|---|
| Graph API / Groups API | Không còn khả thi cho member/post/insight (đã bị gỡ 22/04/2024) | N/A | Không dùng được |
| Meta Business Suite Insights | Chưa xác minh phạm vi hỗ trợ Group tận nguồn gốc | Tuân thủ (dùng tính năng chính thức) | Có thể thiếu số liệu treemap/word cloud cần |
| Group Insights/Overview (UI admin) | Khả thi, xem thủ công qua web/app | Tuân thủ | Không có API, phải copy tay, không tự động hóa được |
| Browser automation/scraping tài khoản cá nhân | Khả thi kỹ thuật | Vi phạm rõ ràng điều khoản dịch vụ | Khóa tài khoản cá nhân + mất quyền admin group |
| Tool scraping bên thứ 3 (Apify...) | Khả thi nếu group Public | Vi phạm điều khoản "phương tiện tự động chưa được phép" | Khóa tài khoản/app, rủi ro pháp lý cho bên cung cấp |
| Nhập liệu thủ công định kỳ + LLM phân loại | Khả thi, an toàn nhất | Tuân thủ hoàn toàn | Không real-time, tốn công vận hành |

**Kết luận sơ bộ:** Không có đường API chính thức nào của Meta hiện còn cấp đủ dữ liệu (member list, post, reaction, views) để tự động dựng dashboard kiểu treemap/word cloud như mô hình Nghiện AI. Phương án khả thi và an toàn nhất là kết hợp Group Insights UI (xem thủ công) + nhập liệu định kỳ + LLM xử lý phân loại chủ đề, chấp nhận không real-time.
