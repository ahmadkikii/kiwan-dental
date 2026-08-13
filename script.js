const cases = [
  {title:"تجميل الأسنان الأمامية", desc:"ابتسامة هوليوود"},
  {title:"تقويم الأسنان", desc:"تصحيح اصطفاف الأسنان"},
  {title:"زرع الأسنان", desc:"تعويض سن مفقود بزراعة"},
  {title:"ترميم الأسنان", desc:"ترميم الأسنان المتضررة"}
];

const grid = document.getElementById("cases-grid");
grid.innerHTML = cases.map((c) => `
  <article class="case-card case-text-only">
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
