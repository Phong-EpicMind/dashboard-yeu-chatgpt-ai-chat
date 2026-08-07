# 0003 — Cách gắn nhãn Chủ đề cho word cloud

## Bối cảnh

Facebook không phân loại chủ đề cho bài đăng. Word cloud "Chủ đề" cần một nguồn nhãn nào đó.

## Quyết định

Rà 132 bài trong bảng Top Posts bằng **cụm từ khóa cố định** (regex/so khớp chuỗi, không phải mô hình phân loại ngữ nghĩa toàn văn) — xem `topics.json` và script tạo ra nó. Một bài có thể khớp nhiều chủ đề cùng lúc nên tổng số lần xuất hiện không bằng 132 bài.

Đây là cách làm nhanh, đủ dùng cho bản đầu, nhưng thô — dễ bỏ sót các chủ đề không nằm trong danh sách từ khóa đã chọn, và dễ gắn nhầm nếu từ khóa xuất hiện ngoài ngữ cảnh liên quan.

## Vì sao cần ghi lại

Nếu sau này thay CSV mới mà không rà lại từ khóa, `topics.json` sẽ đứng yên trong khi dữ liệu khác đã đổi — gây lệch dữ liệu ngầm, khó phát hiện. Người xem trang (khán giả/học viên) không cần biết chi tiết kỹ thuật này trên giao diện — nó chỉ cần xuất hiện dưới dạng tooltip ngắn, còn chi tiết đầy đủ nằm ở đây.

## Ràng buộc bắt buộc

UI chỉ hiển thị dòng chú thích ngắn kèm icon info + tooltip trỏ tới file này, không in nguyên văn đoạn giải thích dài lên trang — trang này công khai cho khán giả/học viên xem, không phải tài liệu nội bộ.
