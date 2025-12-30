document.addEventListener("DOMContentLoaded", () => {
  /* ===== ELEMENTS ===== */
  const music = document.getElementById("music");
  const startBtn = document.getElementById("startBtn");
  const toggleBtn = document.getElementById("themeToggle");
  const surpriseBtn = document.querySelector(".surprise");
  const surpriseText = document.getElementById("surpriseText");
  const confessSection = document.getElementById("confess");
  const confessTexts = document.querySelectorAll(".confess-text");

  /* ======================================================
     MUSIC
  ====================================================== */
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
    if (!audio) return;
    let vol = audio.volume;
    const fade = setInterval(() => {
      vol -= 0.02;
      audio.volume = Math.max(vol, 0.2);
      if (vol <= 0.2) clearInterval(fade);
    }, 150);
  }

  /* ======================================================
     DARK MODE
  ====================================================== */
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

  /* ======================================================
     SCROLL REVEAL
  ====================================================== */
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    },
    { threshold: 0.15 }
  );

  document
    .querySelectorAll(".fade-up, .fade-slide")
    .forEach(el => revealObserver.observe(el));

  /* ======================================================
     SURPRISE
  ====================================================== */
  surpriseBtn?.addEventListener("click", () => {
    surpriseText?.classList.add("show");
    surpriseBtn.style.display = "none";
  });

  /* ======================================================
     CONFESS TYPEWRITER (AMAN UNTUK <br>)
  ====================================================== */
  let confessStarted = false;

  function typeText(element, html, speed = 35) {
  element.innerHTML = "";
  element.style.visibility = "visible";
  element.classList.add("type-cursor");

  let i = 0;

  function typing() {
    if (i < html.length) {

      // JIKA TAG HTML
      if (html[i] === "<") {
        const tagEnd = html.indexOf(">", i);
        element.innerHTML += html.slice(i, tagEnd + 1);
        i = tagEnd + 1;
        setTimeout(typing, 0);
      } 
      // JIKA TEXT BIASA
      else {
        element.innerHTML += html[i];
        i++;
        setTimeout(typing, speed);
      }

    } else {
      element.classList.remove("type-cursor");
    }
  }

  typing();
}


  if (confessSection) {
    const confessObserver = new IntersectionObserver(
      entries => {
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
      { threshold: 0.4 }
    );

    confessObserver.observe(confessSection);
  }
});

/* ======================================================
   COUNTDOWN
====================================================== */
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

/* ======================================================
   FLOATING HEARTS
====================================================== */
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

/* ======================================================
   FLOATING BUBBLES
====================================================== */
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
