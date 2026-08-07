# 0001 — Công thức tính Mindshare Score

## Bối cảnh

Bảng "Top Contributors" của Facebook chỉ cho 3 số riêng lẻ: Posts, Comments, Likes. Dashboard cần một con số % duy nhất cho mỗi người để vẽ treemap (giống ô "15.0% Phong Ho" trong dashboard tham khảo Nghiện AI). Facebook không cung cấp sẵn con số gộp này.

## Quyết định

Mindshare Score của một Contributor = tổng có trọng số của 3 chỉ số, chuẩn hoá thành % trên tổng toàn nhóm:

```
score(người) = Posts × 3 + Comments × 1 + Likes × 0.5
mindshare%(người) = score(người) / tổng(score tất cả contributor) × 100
```

Trọng số Posts=3, Comments=1, Likes=0.5 phản ánh thứ tự công sức bỏ ra (viết một bài tốn công hơn hẳn một comment, một comment tốn công hơn một lượt like) — đây là **lựa chọn chủ quan của dashboard**, không phải chuẩn ngành hay số Facebook đưa ra.

## Vì sao cần ghi lại (khó đảo ngược + gây bất ngờ)

- Đổi trọng số sau này sẽ làm thứ hạng treemap xáo trộn — nếu không ghi lại công thức ban đầu, không ai biết vì sao thứ hạng đổi giữa hai lần xem dashboard.
- Một người đọc dashboard lần đầu (kể cả Phong sau vài tháng) sẽ ngạc nhiên tại sao có % "mindshare" trong khi Facebook không đưa số này — cần ghi rõ đây là công thức tự chế, không phải bịa số để trông giống Facebook.
- Có đánh đổi thật: có thể tính mindshare chỉ bằng Posts (đơn giản, nhưng bỏ qua người bình luận nhiều), hoặc bằng tổng thô không trọng số (dễ hiểu nhưng đánh đồng 1 bài = 1 comment = 1 like, sai lệch thực tế).

## Ràng buộc bắt buộc khi hiển thị

Mọi nơi hiển thị Mindshare % trên UI phải có chú thích/tooltip nói rõ đây là "điểm tự tính của dashboard (Posts×3 + Comments×1 + Likes×0.5), không phải số liệu Facebook cung cấp trực tiếp" — theo quy tắc chính xác nguồn gốc của dự án.
