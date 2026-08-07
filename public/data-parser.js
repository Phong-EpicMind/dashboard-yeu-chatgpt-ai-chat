// Parser cho file Group Insights export của Facebook (xem CONTEXT.md).
// Thuần JS, không build tool - chạy được cả trong browser (ES module) và Node (test).

/**
 * @typedef {{date: string, joined: number, postedOrCommented: number, viewed: number, posts: number, comments: number, reactions: number}} DailyInsight
 * @typedef {{weekday: string, value: number}} WeekdayActivity
 * @typedef {{hourLabel: string, weekday: string, value: number}} PopularTimeSlot
 * @typedef {{title: string, member: string, comments: number, reactions: number, views: number, link: string}} TopPost
 * @typedef {{name: string, posts: number, comments: number, likes: number}} Contributor
 * @typedef {{admin: string, postsApproved: number, postsDeclined: number, postsRemoved: number, participantsApproved: number, participantsDeclined: number}} AdminModeration
 * @typedef {{daily: DailyInsight[], weekdayActivity: WeekdayActivity[], popularTimes: PopularTimeSlot[], topPosts: TopPost[], contributors: Contributor[], adminModeration: AdminModeration[]}} GroupInsightsData
 */

const SECTION_MARKERS = {
  daily: 'Date',
  nameValue: 'Name',
  topPosts: 'Top Posts',
  contributors: 'Top Contributors',
  admin: 'Admin',
};

function toNumber(raw) {
  if (raw === undefined || raw === null || raw === '') return 0;
  const n = Number(String(raw).replace(/,/g, '').trim());
  return Number.isFinite(n) ? n : 0;
}

/** Parse CSV thô (hỗ trợ ô nhiều dòng, dấu phẩy trong ngoặc kép - chuẩn RFC 4180) thành mảng các dòng (mỗi dòng là mảng cột). */
function parseCsvRows(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field); field = '';
    } else if (c === '\r') {
      // bỏ qua, xử lý xuống dòng ở \n
    } else if (c === '\n') {
      row.push(field); field = '';
      rows.push(row); row = [];
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows.filter((r) => !(r.length === 1 && r[0] === ''));
}

/** Tìm chỉ số dòng của mỗi bảng con dựa trên nội dung ô đầu tiên, không hardcode số dòng. */
function findSectionStarts(rows) {
  const starts = {};
  rows.forEach((row, i) => {
    const first = (row[0] || '').trim();
    if (first === SECTION_MARKERS.daily && starts.daily === undefined) starts.daily = i;
    else if (first === SECTION_MARKERS.nameValue && starts.nameValue === undefined) starts.nameValue = i;
    else if (first === SECTION_MARKERS.topPosts && starts.topPosts === undefined) starts.topPosts = i;
    else if (first === SECTION_MARKERS.contributors && starts.contributors === undefined) starts.contributors = i;
    else if (first === SECTION_MARKERS.admin && starts.admin === undefined) starts.admin = i;
  });
  return starts;
}

function sliceSection(rows, start, allStarts) {
  if (start === undefined) return [];
  const nextStarts = Object.values(allStarts).filter((s) => s > start).sort((a, b) => a - b);
  const end = nextStarts.length > 0 ? nextStarts[0] : rows.length;
  return rows.slice(start + 1, end).filter((r) => r.some((c) => c && c.trim() !== ''));
}

/** @returns {GroupInsightsData} */
function parseGroupInsights(csvText) {
  const rows = parseCsvRows(csvText);
  const starts = findSectionStarts(rows);

  const daily = sliceSection(rows, starts.daily, starts)
    .filter((r) => /^\d{4}-\d{2}-\d{2}$/.test(r[0]))
    .map((r) => ({
      date: r[0],
      joined: toNumber(r[1]),
      postedOrCommented: toNumber(r[2]),
      viewed: toNumber(r[3]),
      posts: toNumber(r[4]),
      comments: toNumber(r[5]),
      reactions: toNumber(r[6]),
    }));

  const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const nameValueRows = sliceSection(rows, starts.nameValue, starts);
  const weekdayActivity = [];
  const popularTimes = [];
  let currentHourLabel = null;
  for (const r of nameValueRows) {
    const label = (r[0] || '').trim();
    if (label === 'Popular Times') { currentHourLabel = (r[1] || '').trim(); continue; }
    if (!WEEKDAYS.includes(label)) continue;
    if (currentHourLabel === null) weekdayActivity.push({ weekday: label, value: toNumber(r[1]) });
    else popularTimes.push({ hourLabel: currentHourLabel, weekday: label, value: toNumber(r[1]) });
  }

  const topPosts = sliceSection(rows, starts.topPosts, starts)
    .filter((r) => (r[5] || '').startsWith('http'))
    .map((r) => ({
      title: r[0] || '',
      member: r[1] || '',
      comments: toNumber(r[2]),
      reactions: toNumber(r[3]),
      views: toNumber(r[4]),
      link: r[5] || '',
    }));

  const contributors = sliceSection(rows, starts.contributors, starts)
    .filter((r) => (r[0] || '').trim() !== '')
    .map((r) => ({
      name: r[0],
      posts: toNumber(r[1]),
      comments: toNumber(r[2]),
      likes: toNumber(r[3]),
    }));

  const adminModeration = sliceSection(rows, starts.admin, starts)
    .filter((r) => (r[0] || '').trim() !== '')
    .map((r) => ({
      admin: r[0],
      postsApproved: toNumber(r[1]),
      postsDeclined: toNumber(r[2]),
      postsRemoved: toNumber(r[3]),
      participantsApproved: toNumber(r[4]),
      participantsDeclined: toNumber(r[5]),
    }));

  return { daily, weekdayActivity, popularTimes, topPosts, contributors, adminModeration };
}

/** Công thức Mindshare - xem docs/adr/0001-mindshare-score-formula.md. Trọng số tự chọn, KHÔNG phải số Facebook cung cấp. */
function computeMindshare(contributors) {
  const scored = contributors.map((c) => ({
    ...c,
    score: c.posts * 3 + c.comments * 1 + c.likes * 0.5,
  }));
  const total = scored.reduce((sum, c) => sum + c.score, 0);
  return scored
    .map((c) => ({ ...c, mindsharePct: total > 0 ? (c.score / total) * 100 : 0 }))
    .sort((a, b) => b.mindsharePct - a.mindsharePct);
}

/** Chia đôi kỳ báo cáo và tính % thay đổi - xem docs/adr/0002-period-comparison-split.md. */
function computeOverviewCards(daily) {
  const sorted = [...daily].sort((a, b) => a.date.localeCompare(b.date));
  const half = Math.ceil(sorted.length / 2);
  const previous = sorted.slice(0, sorted.length - half);
  const current = sorted.slice(sorted.length - half);

  const sum = (arr, key) => arr.reduce((s, d) => s + d[key], 0);
  const pctChange = (curr, prev) => (prev === 0 ? null : ((curr - prev) / prev) * 100);

  const metrics = ['joined', 'viewed', 'posts'];
  const cards = {};
  for (const key of metrics) {
    const currSum = sum(current, key);
    const prevSum = sum(previous, key);
    cards[key] = { current: currSum, previous: prevSum, pctChange: pctChange(currSum, prevSum) };
  }
  const currInteractions = sum(current, 'comments') + sum(current, 'reactions');
  const prevInteractions = sum(previous, 'comments') + sum(previous, 'reactions');
  cards.interactions = { current: currInteractions, previous: prevInteractions, pctChange: pctChange(currInteractions, prevInteractions) };

  return {
    periodLabel: current.length > 0 ? `${current[0].date} - ${current[current.length - 1].date}` : '',
    previousPeriodLabel: previous.length > 0 ? `${previous[0].date} - ${previous[previous.length - 1].date}` : null,
    cards,
  };
}

/** Ngày cao điểm/thấp điểm theo một chỉ số (vd 'viewed') trong toàn kỳ báo cáo. */
function findPeakAndQuietDay(daily, metric) {
  if (daily.length === 0) return { peak: null, quiet: null };
  const sorted = [...daily].sort((a, b) => a[metric] - b[metric]);
  return { quiet: sorted[0], peak: sorted[sorted.length - 1] };
}

/** Hiệu suất nội dung = lượt xem trung bình / bài, so kỳ này với kỳ trước - dùng cùng cách chia đôi ở ADR 0002. */
function computeContentEfficiency(daily) {
  const sorted = [...daily].sort((a, b) => a.date.localeCompare(b.date));
  const half = Math.ceil(sorted.length / 2);
  const previous = sorted.slice(0, sorted.length - half);
  const current = sorted.slice(sorted.length - half);
  const sum = (arr, key) => arr.reduce((s, d) => s + d[key], 0);
  const avg = (arr) => (sum(arr, 'posts') > 0 ? sum(arr, 'viewed') / sum(arr, 'posts') : 0);
  const currentAvg = avg(current);
  const previousAvg = avg(previous);
  return {
    currentAvg,
    previousAvg,
    pctChange: previousAvg === 0 ? null : ((currentAvg - previousAvg) / previousAvg) * 100,
  };
}

const DataParser = {
  parseCsvRows, parseGroupInsights, computeMindshare, computeOverviewCards,
  findPeakAndQuietDay, computeContentEfficiency,
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataParser;
} else {
  window.DataParser = DataParser;
}
