document.addEventListener("DOMContentLoaded", () => {

  const confessSection = document.getElementById("confess");
  const confessTexts = document.querySelectorAll(".confess-text");
  const music = document.getElementById("music");
  const startBtn = document.getElementById("startBtn");
  const toggleBtn = document.getElementById("themeToggle");
  const surpriseBtn = document.querySelector(".surprise");
  const surpriseText = document.getElementById("surpriseText");

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

  function lowerMusic(audio) {
    let vol = audio.volume;
    const fade = setInterval(() => {
      vol -= 0.02;
      audio.volume = Math.max(vol, 0);
      if (vol <= 0) clearInterval(fade);
    }, 120);
  }

  /* ================= TYPING EFFECT ================= */
  function typeText(element, text, speed = 35) {
    element.textContent = "";
    element.style.visibility = "visible";
    element.classList.add("type"); // cursor effect

    let i = 0;
    function typing() {
      if (i < text.length) {
        element.textContent += text[i];
        i++;
        setTimeout(typing, speed);
      } else {
        element.classList.remove("type");
      }
    }
    typing();
  }

  /* ================= SCROLL FADE-UP FOR ALL SECTIONS ================= */
  const faders = document.querySelectorAll('.fade-up, .fade-slide');
  const appearOptions = { threshold: 0.5 };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(fader => appearOnScroll.observe(fader));

  /* ================= CONFESS SECTION ================= */
  let confessStarted = false;

  if (confessSection) {
    const confessObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !confessStarted) {
            confessStarted = true;

            confessSection.classList.add("active");
            document.body.classList.add("calm");
            lowerMusic(music);

            let delay = 0;
            confessTexts.forEach(text => {
              const original = text.innerHTML;
              setTimeout(() => {
                typeText(text, original);
              }, delay);
              delay += original.length * 35 + 600;
            });
          }
        });
      },
      { threshold: 0.7 }
    );

    confessObserver.observe(confessSection);
  }

  /* ================= DARK MODE ================= */
  toggleBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    toggleBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  });

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggleBtn.textContent = "☀️";
  }

  /* ================= SURPRISE ================= */
  surpriseBtn?.addEventListener("click", () => {
    if (!surpriseText) return;
    surpriseText.classList.add("show");
    surpriseBtn.style.display = "none";
  });

  /* ================= COUNTDOWN ================= */
  const targetDate = new Date("January 13, 2026 00:00:00").getTime();
  setInterval(() => {
    const now = Date.now();
    const d = targetDate - now;
    if (d < 0) return;
    document.getElementById("days").textContent = Math.floor(d / 86400000);
    document.getElementById("hours").textContent = String(Math.floor(d / 3600000) % 24).padStart(2,'0');
    document.getElementById("minutes").textContent = String(Math.floor(d / 60000) % 60).padStart(2,'0');
    document.getElementById("seconds").textContent = String(Math.floor(d / 1000) % 60).padStart(2,'0');
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

});
