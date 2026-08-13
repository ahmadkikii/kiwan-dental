// حالات العيادة تُحفظ في Cloudflare KV عبر لوحة الإدارة.
// هذا رابط الـ Worker المسؤول عن لوحة الحالات.
const CASES_API_BASE = "https://llgaming.workers.dev";
const grid = document.getElementById("cases-grid");

const specialtyNames = {
  implants: "زرع الأسنان",
  orthodontics: "تقويم الأسنان",
  endodontic: "المعالجة اللبية",
  restorative: "المعالجات الترميمية",
  cosmetic: "تجميل الأسنان"
};

const esc = (value) => String(value ?? "").replace(/[&<>\"']/g, (m) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '\"': "&quot;",
  "'": "&#39;"
}[m]));

const absoluteMediaUrl = (value) => {
  if (!value) return "";
  const raw = String(value).trim();
  if (/^https?:\/\//i.test(raw)) return raw;
  return `${CASES_API_BASE}${raw.startsWith("/") ? raw : `/${raw}`}`;
};

function renderCases(rows) {
  if (!rows.length) {
    grid.innerHTML = "";
    return;
  }

  grid.innerHTML = rows.map((row) => {
    const title = row.title || "حالة علاجية";
    const description = row.description || "";
    const specialty = row.specialty || "";
    const before = absoluteMediaUrl(row.beforeUrl);
    const after = absoluteMediaUrl(row.afterUrl);
    const specialtyLabel = specialtyNames[specialty] || "";

    return `
      <article class="case-card dynamic-case-card">
        ${(before || after) ? `
          <div class="case-images">
            ${before ? `<div class="case-photo"><span>قبل</span><img src="${esc(before)}" alt="${esc(title)} - قبل العلاج" loading="lazy"></div>` : ""}
            ${after ? `<div class="case-photo"><span>بعد</span><img src="${esc(after)}" alt="${esc(title)} - بعد العلاج" loading="lazy"></div>` : ""}
          </div>
        ` : ""}
        <div class="case-body">
          ${specialtyLabel ? `<small class="case-specialty">${esc(specialtyLabel)}</small>` : ""}
          <h3>${esc(title)}</h3>
          ${description ? `<p>${esc(description)}</p>` : ""}
        </div>
      </article>
    `;
  }).join("");
}

async function loadCases() {
  if (!grid) return;

  try {
    const response = await fetch(`${CASES_API_BASE}/api/cases`, {
      method: "GET",
      cache: "no-store"
    });

    if (!response.ok) {
      console.error("تعذر تحميل الحالات من لوحة الإدارة:", response.status, await response.text());
      grid.innerHTML = "";
      return;
    }

    const data = await response.json();
    renderCases(Array.isArray(data.cases) ? data.cases : []);
  } catch (error) {
    console.error("تعذر الاتصال بخادم الحالات:", error);
    grid.innerHTML = "";
  }
}

loadCases();

const menuBtn = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  document.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));
}

const sections = [...document.querySelectorAll("main section[id]")];
const links = [...document.querySelectorAll(".nav a")];
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id));
    }
  });
}, { rootMargin: "-35% 0px -55% 0px" });
sections.forEach((s) => observer.observe(s));
