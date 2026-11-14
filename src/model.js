export const months = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
];
export const units = [
  { id: "product", name: "محصول و فناوری", color: "#16a394" },
  { id: "sales", name: "فروش و بازاریابی", color: "#6478e4" },
  { id: "operations", name: "عملیات", color: "#e5ad50" },
];
export const records = units.flatMap((unit, u) =>
  months.map((month, m) => ({
    unit: unit.id,
    month: m,
    revenue:
      [248, 186, 132][u] + m * [29, 18, 12][u] + [0, 17, -12, 22, -8, 35][m],
    cost: [156, 121, 86][u] + m * [12, 9, 7][u],
    target: [270, 210, 150][u] + m * 18,
  })),
);
export const projects = [
  {
    id: "DB-101",
    name: "سامانه گزارش‌گیری یکپارچه",
    client: "گروه نمونه آبان",
    unit: "product",
    owner: "تیم محصول",
    budget: 480,
    spent: 324,
    progress: 72,
    status: "active",
    month: 5,
    due: "۲۵ شهریور",
    summary:
      "یکپارچه‌سازی گزارش‌های فروش، هزینه و عملکرد واحدها در یک نمای مدیریتی.",
    tasks: [
      "مدل داده و شاخص‌ها",
      "نمای مدیریتی و فیلترها",
      "آزمون پذیرش و تحویل",
    ],
    done: 2,
  },
  {
    id: "DB-102",
    name: "بازطراحی مسیر فروش",
    client: "شرکت نمونه سپهر",
    unit: "sales",
    owner: "تیم رشد",
    budget: 260,
    spent: 218,
    progress: 58,
    status: "risk",
    month: 5,
    due: "۲۸ شهریور",
    summary: "بازبینی مراحل جذب تا خرید و تعریف گزارش هفتگی تبدیل مشتری.",
    tasks: ["تحلیل مسیر فعلی", "طراحی سناریوهای جدید", "اندازه‌گیری نتیجه"],
    done: 1,
  },
  {
    id: "DB-103",
    name: "اتوماسیون درخواست‌های داخلی",
    client: "گروه نمونه آبان",
    unit: "operations",
    owner: "تیم عملیات",
    budget: 190,
    spent: 131,
    progress: 84,
    status: "active",
    month: 4,
    due: "۳۰ شهریور",
    summary: "ثبت و پیگیری درخواست‌ها و کاهش ورود دستی اطلاعات.",
    tasks: ["تعریف فرایند", "نسخه آزمایشی", "تحویل و آموزش"],
    done: 2,
  },
  {
    id: "DB-104",
    name: "پرتال خدمات مشتریان",
    client: "شرکت نمونه روشن",
    unit: "product",
    owner: "تیم محصول",
    budget: 620,
    spent: 566,
    progress: 100,
    status: "done",
    month: 4,
    due: "۱۸ شهریور",
    summary: "نمایش خدمات، وضعیت درخواست و گزارش‌های مشتری در یک پرتال.",
    tasks: ["طراحی تجربه کاربری", "توسعه پرتال", "آزمون و استقرار"],
    done: 3,
  },
  {
    id: "DB-105",
    name: "کمپین معرفی محصول",
    client: "شرکت نمونه سپهر",
    unit: "sales",
    owner: "تیم رشد",
    budget: 180,
    spent: 92,
    progress: 45,
    status: "active",
    month: 3,
    due: "۳۱ شهریور",
    summary: "آماده‌سازی محتوای معرفی محصول و ارزیابی کانال‌های جذب.",
    tasks: ["برنامه محتوا", "اجرای نمونه", "گزارش ارزیابی"],
    done: 1,
  },
  {
    id: "DB-106",
    name: "پایش ظرفیت خدمات",
    client: "شرکت نمونه روشن",
    unit: "operations",
    owner: "تیم عملیات",
    budget: 240,
    spent: 216,
    progress: 100,
    status: "done",
    month: 2,
    due: "۲۹ خرداد",
    summary: "تعریف ظرفیت تیم‌ها و ارائه گزارش مصرف منابع.",
    tasks: ["تعریف ظرفیت", "پیاده‌سازی گزارش", "تأیید خروجی"],
    done: 3,
  },
  {
    id: "DB-107",
    name: "کتابخانه طراحی محصول",
    client: "گروه نمونه آبان",
    unit: "product",
    owner: "تیم محصول",
    budget: 150,
    spent: 143,
    progress: 100,
    status: "done",
    month: 1,
    due: "۲۸ اردیبهشت",
    summary: "اجزای قابل استفاده مجدد و مستندات طراحی رابط.",
    tasks: ["طراحی اجزا", "مستندات", "تحویل"],
    done: 3,
  },
  {
    id: "DB-108",
    name: "تحلیل بخش‌بندی مشتریان",
    client: "شرکت نمونه سپهر",
    unit: "sales",
    owner: "تیم رشد",
    budget: 120,
    spent: 115,
    progress: 100,
    status: "done",
    month: 0,
    due: "۳۰ فروردین",
    summary: "بخش‌بندی مجموعه داده آزمایشی مشتریان برای گزارش مدیریتی.",
    tasks: ["آماده‌سازی داده", "تحلیل", "گزارش"],
    done: 3,
  },
];
export const statuses = {
  active: "در حال اجرا",
  risk: "نیازمند توجه",
  done: "تکمیل‌شده",
};
export function selectRecords(unit = "all", range = 6) {
  return records.filter(
    (r) => (unit === "all" || r.unit === unit) && r.month >= 6 - Number(range),
  );
}
export function metrics(rows) {
  const revenue = rows.reduce((s, r) => s + r.revenue, 0),
    cost = rows.reduce((s, r) => s + r.cost, 0),
    target = rows.reduce((s, r) => s + r.target, 0);
  return {
    revenue,
    cost,
    profit: revenue - cost,
    margin: revenue ? ((revenue - cost) / revenue) * 100 : 0,
    target,
    attainment: target ? (revenue / target) * 100 : 0,
  };
}
export function selectProjects({
  unit = "all",
  range = 6,
  status = "all",
  query = "",
} = {}) {
  const q = query.trim().toLocaleLowerCase();
  return projects.filter(
    (p) =>
      (unit === "all" || p.unit === unit) &&
      p.month >= 6 - Number(range) &&
      (status === "all" || p.status === status) &&
      `${p.name} ${p.client} ${p.id}`.toLocaleLowerCase().includes(q),
  );
}
export function csv(rows) {
  const escape = (v) => {
    let text = String(v ?? "");
    if (/^[=+@\-\t\r]/.test(text)) text = "'" + text;
    return '"' + text.replaceAll('"', '""') + '"';
  };
  return "\uFEFF" + rows.map((r) => r.map(escape).join(",")).join("\r\n");
}
