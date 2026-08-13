const cases = [
  {title:"تجميل الأسنان الأمامية", desc:"ابتسامة هوليوود", before:"assets/case-1.jpg", after:"assets/case-1.jpg"},
  {title:"تقويم الأسنان", desc:"تصحيح اصطفاف الأسنان", before:"assets/case-2.jpg", after:"assets/case-2.jpg"},
  {title:"زرع الأسنان", desc:"تعويض سن مفقود بزراعة", before:"assets/case-3.jpg", after:"assets/case-3.jpg"},
  {title:"ترميم الأسنان", desc:"ترميم الأسنان المتضررة", before:"assets/case-4.jpg", after:"assets/case-4.jpg"}
];

const grid = document.getElementById("cases-grid");
grid.innerHTML = cases.map((c) => `
  <article class="case-card">
    <div class="case-images">
      <div class="case-side"><img src="${c.before}" alt="قبل - ${c.title}"><span>قبل</span></div>
      <div class="case-side"><img src="${c.after}" alt="بعد - ${c.title}"><span>بعد</span></div>
    </div>
    <div class="case-body">
      <h3>${c.title}</h3>
      <p>${c.desc}</p>
      <a href="#contact">عرض التفاصيل</a>
    </div>
  </article>
`).join("");

const menuBtn = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
document.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

const sections = [...document.querySelectorAll("main section[id]")];
const links = [...document.querySelectorAll(".nav a")];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id));
    }
  });
}, {rootMargin:"-35% 0px -55% 0px"});
sections.forEach(s => observer.observe(s));
