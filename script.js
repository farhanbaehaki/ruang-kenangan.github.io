document.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById("music");
  const startBtn = document.getElementById("startBtn");
  const toggleBtn = document.getElementById("themeToggle");

  /* ================= MUSIC ================= */
  if (music) music.volume = 0;
  startBtn?.addEventListener("click", async () => {
    try {
      await music.play();
      fadeInMusic(music);
    } catch {
      alert("Musik diblokir browser 😢");
    }
  });
  function fadeInMusic(audio) {
    let vol = 0;
    const fade = setInterval(() => {
      vol += 0.02;
      audio.volume = Math.min(vol, 0.6);
      if (vol >= 0.6) clearInterval(fade);
    }, 120);
  }

  /* ================= SCROLL REVEAL ================= */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("show");
      });
    },
    { threshold: 0.15 }
  );
  document
    .querySelectorAll(".fade-up, .fade-slide")
    .forEach((el) => revealObserver.observe(el));

  /* ================= DARK MODE ================= */
  toggleBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    toggleBtn.textContent = document.body.classList.contains("dark")
      ? "☀️"
      : "🌙";
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
  });
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggleBtn.textContent = "☀️";
  }

  /* ================= SURPRISE ================= */
  const surpriseBtn = document.querySelector(".surprise");
  const surpriseText = document.getElementById("surpriseText");
  surpriseBtn?.addEventListener("click", () => {
    if (!surpriseText) return;
    surpriseText.classList.add("show");
    surpriseBtn.style.display = "none";
  });
});

/* ================= COUNTDOWN ================= */
const targetDate = new Date("January 13, 2026 00:00:00").getTime();
setInterval(() => {
  const now = Date.now();
  const d = targetDate - now;
  if (d < 0) return;
  document.getElementById("days").textContent = Math.floor(d / 86400000);
  document.getElementById("hours").textContent = Math.floor(d / 3600000) % 24;
  document.getElementById("minutes").textContent = Math.floor(d / 60000) % 60;
  document.getElementById("seconds").textContent = Math.floor(d / 1000) % 60;
}, 1000);

/* ================= FLOATING HEARTS ================= */
const heartsContainer = document.querySelector(".floating-hearts");
if (heartsContainer) {
  setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = Math.random() > 0.5 ? "🤍" : "💗";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = 8 + Math.random() * 6 + "s";
    heart.style.fontSize = 12 + Math.random() * 10 + "px";
    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 14000);
  }, 900);
}

/* ================= FLOATING BUBBLES ================= */
const bubblesContainer = document.querySelector(".floating-bubbles");
if (bubblesContainer) {
  setInterval(() => {
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    const size = Math.random() * 20 + 10;
    bubble.style.width = bubble.style.height = size + "px";
    bubble.style.left = Math.random() * 100 + "vw";
    bubble.style.animationDuration = 8 + Math.random() * 6 + "s";
    bubblesContainer.appendChild(bubble);
    setTimeout(() => bubble.remove(), 14000);
  }, 600);
}

const confessSection = document.getElementById("confess");
const confessTexts = document.querySelectorAll(".confess-text");
const music = document.getElementById("music");

let confessStarted = false;

function typeText(element, text, speed = 35) {
  element.innerHTML = "";
  element.style.visibility = "visible";
  let i = 0;

  function typing() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }
  typing();
}

function lowerMusic(audio) {
  if (!audio) return;
  let vol = audio.volume;

  const fade = setInterval(() => {
    vol -= 0.02;
    audio.volume = Math.max(vol, 0.2);
    if (vol <= 0.2) clearInterval(fade);
  }, 150);
}

/* DETEKSI SAAT CONFESS MASUK VIEW */
const confessObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !confessStarted) {
      confessStarted = true;
      confessSection.classList.add("active");
      lowerMusic(music);

      let delay = 0;
      confessTexts.forEach(p => {
        const original = p.innerHTML;
        setTimeout(() => {
          typeText(p, original);
        }, delay);
        delay += original.length * 35 + 500;
      });
    }
  });
}, { threshold: 0.4 });

confessObserver.observe(confessSection);
