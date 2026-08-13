const cases = [
  {title:"تجميل الأسنان الأمامية", desc:"ابتسامة هوليوود", image:"assets/case-cosmetic.svg"},
  {title:"تقويم الأسنان", desc:"تصحيح اصطفاف الأسنان", image:"assets/case-orthodontics.svg"},
  {title:"زرع الأسنان", desc:"تعويض سن مفقود بزراعة", image:"assets/case-implant.svg"},
  {title:"ترميم الأسنان", desc:"ترميم الأسنان المتضررة", image:"assets/case-restorative.svg"}
];

const grid = document.getElementById("cases-grid");
grid.innerHTML = cases.map((c) => `
  <article class="case-card">
    <div class="case-image"><img src="${c.image}" alt="رسم توضيحي - ${c.title}"></div>
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
