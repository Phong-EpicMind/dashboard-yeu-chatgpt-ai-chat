# 0002 — Cách chia kỳ để tính % so với kỳ trước

## Bối cảnh

Dashboard tham khảo Nghiện AI có nút chọn 7D/14D/30D và mỗi thẻ số liệu có "% so với kỳ trước". Dữ liệu Group Insights của Phong xuất ra là **một khoảng ngày cố định, liên tục** (vd 29 ngày: 09/07 → 05/08), không phải dữ liệu sống có thể chọn khung 7D/14D/30D tuỳ ý — vì Facebook Group Insights giới hạn khoảng ngày ngay tại lúc export, dashboard không có quyền hỏi thêm dữ liệu ngoài khoảng đó.

## Quyết định

Bản đầu (dựng từ 1 file export tĩnh) **không làm nút chọn 7D/14D/30D** như bản gốc — vì làm nút đó mà không có đủ dữ liệu linh hoạt phía sau sẽ đánh lừa người xem là dashboard "sống". Thay vào đó:

- Chia đúng khoảng ngày đang có làm đôi: nửa gần nhất ("kỳ này") so với nửa trước đó ("kỳ trước"). Nếu số ngày lẻ, nửa gần nhất lấy nhiều hơn 1 ngày.
- Thẻ số liệu ghi rõ khoảng ngày cụ thể của "kỳ này" (vd "23/07 - 05/08") thay vì nhãn trừu tượng "30D", vì con số ngày thực tế do Phong xuất quyết định, không phải hằng số 7/14/30.

## Vì sao cần ghi lại

- Khó đảo ngược theo nghĩa: nếu sau này có nhiều file export nối tiếp nhau (đa kỳ), cách chia "nửa/nửa" này sẽ phải đổi sang chọn theo mốc ngày thật (7D/14D/30D tính từ ngày mới nhất) — quyết định hôm nay chỉ đúng cho trường hợp 1 file tĩnh, cần biết rõ để không nhầm là thiết kế cuối cùng.
- Gây bất ngờ nếu không ghi chú: người xem quen dashboard Nghiện AI sẽ hỏi tại sao không có nút 7D/14D/30D — cần lý do rõ ràng (thiếu dữ liệu đa kỳ, không phải quên làm).
