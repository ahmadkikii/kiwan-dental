const SUPABASE_URL = "https://itwlmzrksznqsbcihcsf.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_UhDLXe1ACmH2FmnnvfHksOg_Lct4SX3u";
const CASES_BUCKET = "case-image";

const grid = document.getElementById("cases-grid");

const esc = (value) => String(value ?? "").replace(/[&<>\"']/g, (m) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '\"': "&quot;",
  "'": "&#39;"
}[m]));

const firstValue = (obj, keys) => {
  for (const key of keys) {
    if (obj && obj[key] !== undefined && obj[key] !== null && String(obj[key]).trim() !== "") {
      return obj[key];
    }
  }
  return "";
};

const storageUrl = (value) => {
  if (!value) return "";
  const raw = String(value).trim();
  if (/^https?:\/\//i.test(raw)) return raw;
  const path = raw.replace(/^\/+/, "");
  return `${SUPABASE_URL}/storage/v1/object/public/${CASES_BUCKET}/${path.split("/").map(encodeURIComponent).join("/")}`;
};

const specialtyNames = {
  implants: "زرع الأسنان",
  orthodontics: "تقويم الأسنان",
  endodontic: "المعالجة اللبية",
  restorative: "المعالجات الترميمية",
  cosmetic: "تجميل الأسنان"
};

function renderCases(rows) {
  if (!rows.length) {
    grid.innerHTML = "";
    return;
  }

  grid.innerHTML = rows.map((row) => {
    const title = firstValue(row, ["title", "name", "case_title"]) || "حالة علاجية";
    const description = firstValue(row, ["description", "desc", "details"]);
    const specialty = firstValue(row, ["specialty", "category", "type"]);
    const before = storageUrl(firstValue(row, ["before_image", "beforeImage", "before_url", "beforeUrl", "before", "before_key", "beforeKey"]));
    const after = storageUrl(firstValue(row, ["after_image", "afterImage", "after_url", "afterUrl", "after", "after_key", "afterKey"]));
    const specialtyLabel = specialtyNames[specialty] || "";

    return `
      <article class="case-card">
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
    const response = await fetch(`${SUPABASE_URL}/rest/v1/cases?select=*`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      },
      cache: "no-store"
    });

    if (!response.ok) {
      console.error("تعذر تحميل الحالات من Supabase:", response.status, await response.text());
      grid.innerHTML = "";
      return;
    }

    const rows = await response.json();
    renderCases(Array.isArray(rows) ? rows : []);
  } catch (error) {
    console.error("تعذر الاتصال بـ Supabase:", error);
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
