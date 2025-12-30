document.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById("music");
  const startBtn = document.getElementById("startBtn");
  const toggleBtn = document.getElementById("themeToggle");
  const surpriseBtn = document.querySelector(".surprise");
  const surpriseText = document.getElementById("surpriseText");

  /* --- TYPING EFFECT ENGINE --- */
  function typeText(element, html, speed = 35) {
    element.innerHTML = ""; element.style.visibility = "visible";
    let i = 0; 
    const typing = setInterval(() => {
      if (i < html.length) {
        element.innerHTML = html.substring(0, i + 1);
        i++;
      } else { clearInterval(typing); }
    }, speed);
  }

  /* --- POLAROID & SCROLL LOGIC --- */
  const polaroids = document.querySelectorAll('.polaroid');
  const sections = document.querySelectorAll('.fade-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        if (entry.target.id === "confess") {
          const texts = entry.target.querySelectorAll(".confess-text");
          texts.forEach((t, idx) => setTimeout(() => typeText(t, t.innerHTML), idx * 3000));
        }
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
  polaroids.forEach(p => {
    p.style.setProperty('--rotation', `${(Math.random() * 12 - 6)}deg`);
    p.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.className = 'lightbox';
      overlay.innerHTML = `<img src="${p.querySelector('img').src}">`;
      document.body.appendChild(overlay);
      overlay.onclick = () => overlay.remove();
    });
    observer.observe(p);
  });

  /* --- MUSIC & THEME --- */
  startBtn?.addEventListener("click", () => {
    music.play().then(() => {
      let v = 0; const f = setInterval(() => { if(v<0.6){v+=0.05; music.volume=v;} else clearInterval(f); }, 200);
    });
  });

  toggleBtn.onclick = () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    toggleBtn.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  /* --- COUNTDOWN --- */
  const target = new Date("January 13, 2026 00:00:00").getTime();
  setInterval(() => {
    const diff = target - Date.now();
    if (diff < 0) return;
    document.getElementById("days").textContent = Math.floor(diff / 86400000);
    document.getElementById("hours").textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    document.getElementById("minutes").textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    document.getElementById("seconds").textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  }, 1000);

  /* --- SURPRISE --- */
  surpriseBtn.onclick = () => { surpriseText.classList.add("show"); surpriseBtn.style.display = "none"; };
});