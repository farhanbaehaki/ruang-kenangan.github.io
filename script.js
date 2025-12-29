document.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById("music");
  const startBtn = document.getElementById("startBtn");
  const toggleBtn = document.getElementById("themeToggle");
  const envelope = document.getElementById("envelope");
  const letterText = document.getElementById("letterText");

  /* ===== MUSIC ===== */
  if (music) music.volume = 0;

  startBtn?.addEventListener("click", async () => {
    try {
      await music.play();
      fadeInMusic(music);
    } catch {
      alert("Musik diblokir browser 😢");
    }

    document.querySelector(".hero")?.scrollIntoView({ behavior: "smooth" });
  });

  function fadeInMusic(audio) {
    let vol = 0;
    const fade = setInterval(() => {
      vol += 0.02;
      audio.volume = Math.min(vol, 0.6);
      if (vol >= 0.6) clearInterval(fade);
    }, 120);
  }

  /* ===== ENVELOPE + TYPEWRITER ===== */
if (envelope && letterText) {
  const fullText = letterText.innerHTML;
  letterText.innerHTML = "";
  let index = 0;
  let started = false;

  envelope.addEventListener("click", () => {
    if (envelope.classList.contains("open")) return;

    envelope.classList.add("open");

    setTimeout(() => {
      if (started) return;
      started = true;
      typeWriter();
    }, 900);
  });

function typeWriter() {
  if (index >= fullText.length) {
    letterText.classList.remove("type-caret");
    onTypingFinished();
    return;
  }

  letterText.classList.add("type-caret");

  // HANDLE TAG HTML
  if (fullText[index] === "<") {
    const tagEnd = fullText.indexOf(">", index);
    const tag = fullText.substring(index, tagEnd + 1);
    letterText.innerHTML += tag;
    index = tagEnd + 1;

    // JEDA LEBIH LAMA JIKA <br><br>
    if (tag === "<br>" && fullText.substring(index, index + 4) === "<br>") {
      letterText.innerHTML += "<br>";
      index += 4;
      setTimeout(typeWriter, 800); // 💗 pause paragraf
      return;
    }

    setTimeout(typeWriter, 0);
    return;
  }

  const char = fullText.charAt(index);
  letterText.innerHTML += char;
  index++;

  let delay = 35;
  if (char === ",") delay = 120;
  if (char === ".") delay = 240;

  setTimeout(typeWriter, delay);
}


  function onTypingFinished() {
    const letter = document.querySelector(".letter");

    letter?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    if (letter) {
      letter.style.animation = "heartbeat 1.6s ease-in-out infinite";
    }
  }
}


  /* ===== SCROLL FADE ===== */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".fade").forEach(el => observer.observe(el));

  /* ===== DARK MODE ===== */
  toggleBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    toggleBtn.textContent =
      document.body.classList.contains("dark") ? "☀️" : "🌙";

    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
  });

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggleBtn.textContent = "☀️";
  }
});

// Typewriter untuk surat
letterText.style.opacity = 1; // muncul saat mulai typewriter

// Surprise button
function showSurprise() {
  const text = document.getElementById("surpriseText");
  const btn = document.querySelector(".surprise");
  if (!text) return;
  text.classList.add("show");
  btn && (btn.style.display = "none");
}

/* ===== COUNTDOWN ===== */
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
