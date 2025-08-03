const i = document.getElementById("intro");
const c = document.getElementById("cardInner");
const t = document.querySelector(".title");
const s = document.getElementById("scrollIndicator");
const d = document.getElementById("code-section");

let h = false;

i.addEventListener("mouseenter", () => h = true);
i.addEventListener("mouseleave", () => {
  h = false;
  c.style.transform = "";
  t.style.transform = "";
});

function ht(e) {
  if (!h) return;

  const r = c.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) return;

  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const x = (e.clientX - cx) / (window.innerWidth / 2);
  const y = (e.clientY - cy) / (window.innerHeight / 2);
  const rx = Math.max(-1, Math.min(1, x));
  const ry = Math.max(-1, Math.min(1, y));

  c.style.transform = `rotateX(${ry * -8}deg) rotateY(${rx * 8}deg)`;
  t.style.transform = `rotateX(${ry * -4}deg) rotateY(${rx * 4}deg) translateX(${rx * 2}px) translateY(${ry * -2}px)`;
}

window.addEventListener("DOMContentLoaded", () => {
  i.addEventListener("mousemove", ht);
  d.style.opacity = 0;
  d.style.pointerEvents = "none";
});

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  const f = Math.min(y / (window.innerHeight * 0.3), 1);

  i.style.opacity = 1 - f;
  i.style.pointerEvents = f < 0.9 ? "auto" : "none";

  d.style.opacity = f;
  d.style.pointerEvents = f > 0.1 ? "auto" : "none";

  s.style.opacity = f > 0.1 ? 0 : 1;
});

function cc() {
  const b = event.target.closest(".copy-button");
  const str = 'loadstring(game:HttpGet("https://raw.githubusercontent.com/hashed-cmd/unexpected-cmd/refs/heads/main/source"))()';

  navigator.clipboard.writeText(str).then(() => {
    b.style.background = "#28a745";
    setTimeout(() => b.style.background = "#21262d", 2000);
  });
}
