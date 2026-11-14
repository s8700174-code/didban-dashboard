import {
  months,
  units,
  projects,
  statuses,
  selectRecords,
  metrics,
  selectProjects,
  csv,
} from "./model.js";
const $ = (s) => document.querySelector(s),
  fa = (n, d = 0) =>
    new Intl.NumberFormat("fa-IR", { maximumFractionDigits: d }).format(n);
const state = {
  unit: "all",
  range: 6,
  status: "all",
  query: "",
  view: "overview",
};
let selected = null,
  toastTimer;
function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
let watched = read("didban-watch", []);
if (!Array.isArray(watched)) watched = [];
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
function toast(text) {
  $("#toast").textContent = text;
  $("#toast").hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ($("#toast").hidden = true), 3500);
}
function setTheme(dark) {
  document.body.classList.toggle("dark", dark);
  $("#theme").setAttribute(
    "aria-label",
    dark ? "فعال‌کردن حالت روشن" : "فعال‌کردن حالت تیره",
  );
}
setTheme(read("didban-dark", false));
$("#theme").onclick = () => {
  const dark = !document.body.classList.contains("dark");
  setTheme(dark);
  save("didban-dark", dark);
};
function render() {
  const rows = selectRecords(state.unit, state.range),
    m = metrics(rows),
    ps = selectProjects({ unit: state.unit, range: state.range });
  const cards = [
    [
      "درآمد کل",
      fa(m.revenue),
      "میلیون تومان",
      "↗",
      `${fa(m.attainment, 1)}٪ از هدف دوره`,
      true,
    ],
    [
      "هزینه عملیاتی",
      fa(m.cost),
      "میلیون تومان",
      "↙",
      `${fa(m.revenue ? (m.cost / m.revenue) * 100 : 0, 1)}٪ از درآمد دوره`,
    ],
    [
      "سود عملیاتی نمونه",
      fa(m.profit),
      "میلیون تومان",
      "◈",
      `حاشیه سود ${fa(m.margin, 1)}٪`,
    ],
    [
      "پروژه‌های باز",
      fa(ps.filter((p) => p.status !== "done").length),
      "پروژه",
      "▤",
      `${fa(ps.filter((p) => p.status === "done").length)} پروژه تکمیل‌شده در دوره`,
    ],
  ];
  $("#metrics").innerHTML = cards
    .map(
      ([label, value, unit, icon, note, featured]) =>
        `<article class="metric ${featured ? "featured" : ""}"><div class="metric-top"><span>${label}</span><span class="metric-icon" aria-hidden="true">${icon}</span></div><div class="metric-value">${value}<span class="metric-unit">${unit}</span></div><div class="metric-bottom">${note}</div></article>`,
    )
    .join("");
  const monthly = months
    .map((name, i) => ({
      name,
      i,
      ...metrics(rows.filter((r) => r.month === i)),
    }))
    .filter((r) => r.i >= 6 - state.range);
  drawTrend(monthly);
  drawTarget(m);
  $("#unit-bars").innerHTML = units
    .filter((u) => state.unit === "all" || u.id === state.unit)
    .map((u) => {
      const n = metrics(rows.filter((r) => r.unit === u.id)).revenue,
        p = m.revenue ? (n / m.revenue) * 100 : 0;
      return `<div class="unit-row"><div class="unit-icon" style="color:${u.color}" aria-hidden="true">▦</div><div class="unit-track"><div class="unit-label"><span>${u.name}</span><b>${fa(n)}</b></div><div class="track"><span style="width:${p}%;background:${u.color}"></span></div></div><span class="unit-percent">${fa(p)}٪</span></div>`;
    })
    .join("");
  const risk = ps.filter((p) => p.status === "risk");
  $("#attention").innerHTML =
    risk
      .map(
        (p) =>
          `<div class="attention-item"><span class="attention-symbol">!</span><div><h3>${p.name}</h3><p>${fa((p.spent / p.budget) * 100)}٪ بودجه مصرف شده؛ پیشرفت ${fa(p.progress)}٪ است.</p><button data-project="${p.id}">بررسی جزئیات ←</button></div></div>`,
      )
      .join("") +
    `<div class="attention-item"><span class="attention-symbol">◎</span><div><h3>${m.attainment >= 100 ? "هدف درآمد دوره محقق شده است" : "فاصله تا هدف درآمد"}</h3><p>${m.attainment >= 100 ? `${fa(m.revenue - m.target)} میلیون تومان بالاتر از هدف آزمایشی.` : `${fa(m.target - m.revenue)} میلیون تومان تا هدف دوره باقی مانده است.`}</p></div></div>`;
  $("#report-rows").innerHTML =
    monthly
      .map(
        (r) =>
          `<tr><th scope="row">${r.name} ۱۴۰۵</th><td>${fa(r.revenue)}</td><td>${fa(r.cost)}</td><td>${fa(r.profit)}</td><td>${fa(r.target)}</td><td>${fa(r.attainment, 1)}٪</td></tr>`,
      )
      .join("") +
    `<tr><th scope="row">مجموع دوره</th><td><b>${fa(m.revenue)}</b></td><td>${fa(m.cost)}</td><td>${fa(m.profit)}</td><td>${fa(m.target)}</td><td>${fa(m.attainment, 1)}٪</td></tr>`;
  renderProjects();
}
function drawTrend(rows) {
  const max = Math.ceil(Math.max(...rows.map((r) => r.revenue), 1) / 200) * 200,
    w = 600,
    h = 210,
    left = 42,
    right = 18,
    top = 12,
    bottom = 35,
    plotH = h - top - bottom,
    step = (w - left - right) / rows.length,
    bw = Math.min(22, step * 0.22);
  let svg = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="نمودار درآمد و هزینه ماهانه؛ ارقام دقیق در بخش گزارش عملکرد موجود است">`;
  for (let t = 0; t <= 4; t++) {
    const y = top + (plotH * t) / 4;
    svg += `<line x1="${left}" x2="${w - right}" y1="${y}" y2="${y}" stroke="var(--border)" stroke-dasharray="3 4"/><text x="${left - 8}" y="${y + 4}" text-anchor="end">${fa(max * (1 - t / 4))}</text>`;
  }
  rows.forEach((r, i) => {
    const cx = left + step * (i + 0.5);
    svg += `<rect x="${cx - bw - 3}" y="${top + plotH - (r.revenue / max) * plotH}" width="${bw}" height="${(r.revenue / max) * plotH}" rx="4" fill="#159a87"><title>${r.name}؛ درآمد ${fa(r.revenue)} میلیون تومان</title></rect><rect x="${cx + 3}" y="${top + plotH - (r.cost / max) * plotH}" width="${bw}" height="${(r.cost / max) * plotH}" rx="4" fill="#c3cfd7"><title>${r.name}؛ هزینه ${fa(r.cost)} میلیون تومان</title></rect><text x="${cx}" y="${h - 10}" text-anchor="middle">${r.name}</text>`;
  });
  $("#trend-chart").innerHTML = svg + "</svg>";
  const best = rows.reduce((a, b) => (a.revenue > b.revenue ? a : b));
  $("#chart-insight").innerHTML =
    `<strong>↗ ${best.name}</strong> با درآمد ${fa(best.revenue)} میلیون تومان، بهترین ماه این بازه است.`;
}
function drawTarget(m) {
  const pct = Math.max(0, Math.min(m.attainment, 100)),
    circ = 2 * Math.PI * 68;
  $("#target-chart").innerHTML =
    `<svg viewBox="0 0 220 185" role="img" aria-label="تحقق هدف ${fa(m.attainment, 1)} درصد"><circle cx="110" cy="86" r="68" fill="none" stroke="var(--border)" stroke-width="11"/><circle cx="110" cy="86" r="68" fill="none" stroke="#239b83" stroke-width="11" stroke-linecap="round" stroke-dasharray="${(circ * pct) / 100} ${circ}" transform="rotate(-90 110 86)"/></svg><div class="gauge-text"><strong>${fa(m.attainment, 1)}<span>٪</span></strong><span>از هدف درآمد دوره</span></div>`;
  $("#target-numbers").innerHTML =
    `<div>درآمد محقق‌شده<b>${fa(m.revenue)}</b></div><div>هدف دوره<b>${fa(m.target)}</b></div>`;
}
function renderProjects() {
  let rows = selectProjects(state);
  const total = rows.length;
  if (state.view === "overview") rows = rows.slice(0, 4);
  $("#project-rows").innerHTML = rows.length
    ? rows
        .map(
          (p) =>
            `<tr><td><button class="project-link" data-project="${p.id}">${p.name}${watched.includes(p.id) ? " ☆" : ""}</button><small>${p.client} · <bdi>${p.id}</bdi></small></td><td><span class="badge ${p.status}">${statuses[p.status]}</span></td><td><div class="progress-cell ${p.status}"><div class="track"><span style="width:${p.progress}%"></span></div>${fa(p.progress)}٪</div></td><td>${fa(p.budget)}</td><td>${fa(p.spent)}</td><td>${p.due}</td><td><button class="detail-button" data-project="${p.id}" aria-label="جزئیات ${p.name}">←</button></td></tr>`,
        )
        .join("")
    : '<tr><td colspan="7" class="empty">پروژه‌ای با این فیلتر پیدا نشد. عبارت جست‌وجو یا وضعیت را تغییر دهید.</td></tr>';
  $("#result-count").textContent =
    `نمایش ${fa(rows.length)} از ${fa(total)} پروژه مطابق فیلتر`;
}
function changeView(view) {
  state.view = ["overview", "projects", "reports"].includes(view)
    ? view
    : "overview";
  const labels = {
    overview: [
      "نمای کلی",
      "نبض کسب‌وکار، در یک نگاه",
      "از اعداد تا تصمیم؛ تصویری یکپارچه از عملکرد سازمان شما.",
    ],
    projects: [
      "پروژه‌ها",
      "هر پروژه، یک مسیر روشن",
      "وضعیت تحویل، پیشرفت و مصرف بودجه را کنار هم ببینید.",
    ],
    reports: [
      "گزارش عملکرد",
      "اعداد روشن، گزارش قابل اتکا",
      "جزئیات ماهانه و مبنای محاسبات؛ آماده بررسی و خروجی گرفتن.",
    ],
  }[state.view];
  $("#breadcrumb").textContent = labels[0];
  $("#page-title").textContent = labels[1];
  $("#page-subtitle").textContent = labels[2];
  $("#overview-view").hidden = state.view !== "overview";
  $("#project-section").hidden = state.view === "reports";
  $("#reports-view").hidden = state.view !== "reports";
  $("#all-projects").hidden = state.view === "projects";
  $("#project-heading").textContent =
    state.view === "projects" ? "فهرست پروژه‌ها" : "پروژه‌های منتخب";
  document.querySelectorAll("[data-view]").forEach((b) => {
    b.classList.toggle("active", b.dataset.view === state.view);
    if (b.dataset.view === state.view) b.setAttribute("aria-current", "page");
    else b.removeAttribute("aria-current");
  });
  renderProjects();
}
document.querySelectorAll("[data-view]").forEach(
  (b) =>
    (b.onclick = () => {
      location.hash = b.dataset.view;
    }),
);
window.addEventListener("hashchange", () => changeView(location.hash.slice(1)));
$("#all-projects").onclick = () => (location.hash = "projects");
$("#range").onchange = (e) => {
  state.range = Number(e.target.value);
  render();
};
$("#unit").onchange = (e) => {
  state.unit = e.target.value;
  render();
};
$("#status").onchange = (e) => {
  state.status = e.target.value;
  renderProjects();
};
$("#search").oninput = (e) => {
  state.query = e.target.value;
  renderProjects();
};
document.addEventListener("click", (e) => {
  const button = e.target.closest("[data-project]");
  if (button) openProject(button.dataset.project);
});
function openProject(id) {
  selected = projects.find((p) => p.id === id);
  if (!selected) return;
  const p = selected;
  $("#detail-content").innerHTML =
    `<h2 id="dialog-title">${p.name}</h2><span class="badge ${p.status}">${statuses[p.status]}</span><p>${p.summary}</p><div class="detail-metrics"><div>بودجه · میلیون تومان<b>${fa(p.budget)}</b></div><div>مصرف‌شده<b>${fa(p.spent)}</b></div><div>پیشرفت<b>${fa(p.progress)}٪</b></div></div><p>${p.owner} · ${p.client}<br>تحویل برنامه‌ریزی‌شده: ${p.due} ۱۴۰۵ · <bdi>${p.id}</bdi></p><h3>مراحل تحویل نمونه</h3><ul class="task-list">${p.tasks.map((task, i) => `<li><span>${i < p.done ? "✓" : "○"}</span>${task} <small>${i < p.done ? "— تکمیل‌شده" : "— در انتظار تکمیل"}</small></li>`).join("")}</ul><p class="fine-print">این اطلاعات نمایشی است. پیگیری پروژه فقط در مرورگر شما ذخیره می‌شود.</p>`;
  updateWatch();
  $("#detail-dialog").showModal();
}
function updateWatch() {
  $("#watch-project").textContent = watched.includes(selected.id)
    ? "حذف از پیگیری"
    : "افزودن به پیگیری";
}
$("#watch-project").onclick = () => {
  const exists = watched.includes(selected.id);
  watched = exists
    ? watched.filter((id) => id !== selected.id)
    : [...watched, selected.id];
  const persisted = save("didban-watch", watched);
  updateWatch();
  renderProjects();
  toast(
    persisted
      ? exists
        ? "پروژه از پیگیری حذف شد."
        : "پروژه در این مرورگر به پیگیری اضافه شد."
      : "تغییر در این نشست اعمال شد؛ ذخیره مرورگر در دسترس نیست.",
  );
};
document
  .querySelectorAll(".close-dialog")
  .forEach((b) => (b.onclick = () => $("#detail-dialog").close()));
document
  .querySelectorAll(".close-about")
  .forEach((b) => (b.onclick = () => $("#about-dialog").close()));
$("#about-button").onclick = () => $("#about-dialog").showModal();
$("#export").onclick = () => {
  let rows;
  if (state.view === "projects") {
    rows = [
      [
        "شناسه",
        "پروژه",
        "مشتری",
        "وضعیت",
        "بودجه (میلیون تومان)",
        "مصرف‌شده (میلیون تومان)",
        "پیشرفت (%)",
      ],
      ...selectProjects(state).map((p) => [
        p.id,
        p.name,
        p.client,
        statuses[p.status],
        p.budget,
        p.spent,
        p.progress,
      ]),
    ];
  } else {
    const data = selectRecords(state.unit, state.range);
    rows = [
      [
        "ماه ۱۴۰۵",
        "واحد",
        "درآمد (میلیون تومان)",
        "هزینه (میلیون تومان)",
        "هدف (میلیون تومان)",
      ],
      ...data.map((r) => [
        months[r.month],
        units.find((u) => u.id === r.unit).name,
        r.revenue,
        r.cost,
        r.target,
      ]),
    ];
  }
  const url = URL.createObjectURL(
    new Blob([csv(rows)], { type: "text/csv;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `didban-demo-${state.view}-${state.unit}-${state.range}m.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("گزارش متناسب با فیلترهای فعلی آماده دانلود شد.");
};
$("#print").onclick = () => window.print();
render();
changeView(location.hash.slice(1) || "overview");
