document.addEventListener("DOMContentLoaded", () => {

  const music = document.getElementById("music");
  const startBtn = document.getElementById("startBtn");
  const toggleBtn = document.getElementById("themeToggle");
  const surpriseBtn = document.querySelector(".surprise");
  const surpriseText = document.getElementById("surpriseText");
  const confessSection = document.getElementById("confess");
  const confessTexts = document.querySelectorAll(".confess-text");

  if (music) music.volume = 0;

  startBtn?.addEventListener("click", async () => {
    try {
      await music.play();
      let v = 0;
      const fade = setInterval(() => {
        v += 0.02;
        music.volume = Math.min(v, 0.6);
        if (v >= 0.6) clearInterval(fade);
      }, 120);
    } catch {}
  });

  toggleBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    toggleBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  });

  const reveal = new IntersectionObserver(e =>
    e.forEach(i => i.isIntersecting && i.target.classList.add("show")),
    { threshold: .15 }
  );
  document.querySelectorAll(".fade-up,.fade-slide").forEach(el => reveal.observe(el));

  surpriseBtn?.addEventListener("click", () => {
    surpriseText.classList.add("show");
    surpriseBtn.style.display = "none";
  });

  let started = false;

  function typeText(el, text, speed = 35) {
    el.innerHTML = "";
    el.style.visibility = "visible";
    el.classList.add("type-cursor");
    let i = 0;
    const t = setInterval(() => {
      el.innerHTML += text[i++];
      if (i >= text.length) {
        clearInterval(t);
        el.classList.remove("type-cursor");
      }
    }, speed);
  }

  if (confessSection) {
    new IntersectionObserver(e => {
      if (e[0].isIntersecting && !started) {
        started = true;
        confessSection.classList.add("active");
        let d = 0;
        confessTexts.forEach(p => {
          const txt = p.textContent;
          setTimeout(() => typeText(p, txt), d);
          d += txt.length * 35 + 500;
        });
      }
    }, { threshold:.4 }).observe(confessSection);
  }
});

/* COUNTDOWN */
const target = new Date("January 13, 2026 00:00:00").getTime();
setInterval(() => {
  const d = target - Date.now();
  if (d < 0) return;
  days.textContent = Math.floor(d / 86400000);
  hours.textContent = Math.floor(d / 3600000) % 24;
  minutes.textContent = Math.floor(d / 60000) % 60;
  seconds.textContent = Math.floor(d / 1000) % 60;
}, 1000);

/* FLOATING */
const hearts = document.querySelector(".floating-hearts");
setInterval(() => {
  if (!hearts) return;
  const h = document.createElement("div");
  h.className = "heart";
  h.textContent = Math.random() > .5 ? "🤍" : "💗";
  h.style.left = Math.random()*100+"vw";
  h.style.animationDuration = 8+Math.random()*6+"s";
  hearts.appendChild(h);
  setTimeout(()=>h.remove(),14000);
},900);

const bubbles = document.querySelector(".floating-bubbles");
setInterval(() => {
  if (!bubbles) return;
  const b = document.createElement("div");
  b.className = "bubble";
  const s = 10+Math.random()*20;
  b.style.width=b.style.height=s+"px";
  b.style.left=Math.random()*100+"vw";
  b.style.animationDuration=8+Math.random()*6+"s";
  bubbles.appendChild(b);
  setTimeout(()=>b.remove(),14000);
},600);
