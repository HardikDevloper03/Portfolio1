// ============ THEME TOGGLE (remembers choice) ============
const root = document.documentElement;
const themeBtn = document.getElementById("themeToggle");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  const toDark = theme === "light";
  themeBtn.innerHTML = toDark ? '<i class="bi bi-moon-stars-fill"></i>' : '<i class="bi bi-sun-fill"></i>';
  themeBtn.setAttribute("aria-label", toDark ? "Switch to dark theme" : "Switch to light theme");
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", toDark ? "#f3f5f8" : "#0c1424");
}
applyTheme(root.getAttribute("data-theme") || "light");

themeBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// ============ HERO: PYTHON REPL TYPES ITSELF ONCE ============
(function replIntro() {
  const repl = document.getElementById("repl");
  if (!repl) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // keep the static text

  const lines = [...repl.querySelectorAll(".repl-line")];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  lines.forEach((l) => (l.hidden = true));

  (async function play() {
    await wait(500);
    for (const line of lines) {
      line.hidden = false;
      const code = line.querySelector(".code");
      if (code) {
        const text = code.textContent;
        code.textContent = "";
        for (const ch of text) {
          code.textContent += ch;
          await wait(18 + Math.random() * 18);
        }
        await wait(260);
      } else if (line.classList.contains("out")) {
        await wait(260);
      }
    }
  })();
})();

// ============ NAVBAR: scrolled state + active link + back-to-top ============
const nav = document.getElementById("mainNav");
const toTop = document.getElementById("toTop");
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 30);
  toTop.classList.toggle("show", y > 500);

  let current = "";
  sections.forEach((sec) => {
    if (y >= sec.offsetTop - 160) current = sec.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + current);
  });
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Close mobile menu after clicking a link
navLinks.forEach((link) =>
  link.addEventListener("click", () => {
    const menu = document.getElementById("navMenu");
    if (menu.classList.contains("show")) {
      bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }
  })
);

// ============ COUNTERS (run once when visible) ============
function animateCounter(el) {
  const target = +el.dataset.target;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = target; return; }
  let count = 0;
  const step = Math.max(1, Math.ceil(target / 50));
  const timer = setInterval(() => {
    count += step;
    if (count >= target) { count = target; clearInterval(timer); }
    el.textContent = count;
  }, 28);
}
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll(".counter").forEach((el) => counterObserver.observe(el));

// ============ PROJECT FILTER ============
const filterBtns = document.querySelectorAll(".filter-btn");
const projectItems = document.querySelectorAll(".project-item");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");

    const filter = btn.dataset.filter;
    projectItems.forEach((item) => {
      const match = filter === "all" || item.dataset.category.split(" ").includes(filter);
      item.classList.toggle("hide", !match);
    });
  });
});

// ============ CONTACT FORM: validate, then open the visitor's email app ============
const form = document.getElementById("contactForm");
const alertBox = document.getElementById("formAlert");
const MY_EMAIL = "you@example.com"; // <-- put your real email here

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    alertBox.classList.add("d-none");
    return;
  }
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  const subject = encodeURIComponent("Portfolio message from " + name);
  const body = encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");
  window.location.href = "mailto:" + MY_EMAIL + "?subject=" + subject + "&body=" + body;

  alertBox.classList.remove("d-none");
  form.reset();
  form.classList.remove("was-validated");
});

// ============ RESUME: download / print as PDF ============
document.getElementById("printResume").addEventListener("click", () => window.print());

// ============ FOOTER YEAR ============
document.getElementById("year").textContent = new Date().getFullYear();
