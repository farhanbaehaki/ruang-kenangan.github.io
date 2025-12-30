document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const confessSection = document.getElementById("confess");
  const confessTexts = document.querySelectorAll(".confess-text");
  const music = document.getElementById("music");
  const startBtn = document.getElementById("startBtn");
  const toggleBtn = document.getElementById("themeToggle");
  const surpriseBtn = document.querySelector(".surprise");
  const surpriseText = document.getElementById("surpriseText");

  /* ==========================================================================
     GALLERY WITH RANDOM ROTATION (POLAROID VERSION)
     ========================================================================== */
// --- Perbaikan Observer di script.js ---
const galleryObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      // Berikan sedikit jeda antar foto agar munculnya satu-satu (staggered)
      console.log("Foto muncul!"); // Untuk cek di console
    }
  });
}, { 
  threshold: 0.05, // Lebih sensitif (1% terlihat langsung muncul)
  rootMargin: "0px 0px -50px 0px" // Muncul sebelum benar-benar sampai di tengah layar
});

polaroids.forEach((item) => {
  // Pastikan rotasi acak tetap ada
  const randomRot = (Math.random() * 10 - 5).toFixed(2);
  item.style.setProperty('--rotation', `${randomRot}deg`);
  
  galleryObserver.observe(item);
});

  /* ==========================================================================
     MUSIC CONTROL (Fade In/Out)
     ========================================================================== */
  if (music) music.volume = 0;

  startBtn?.addEventListener("click", async () => {
    try {
      await music.play();
      fadeInMusic(music, 0.6, 0.02);
    } catch (err) {
      alert("Musik diblokir browser 😢");
    }
  });

  function fadeInMusic(audio, target = 0.6, step = 0.02) {
    function tick() {
      audio.volume = Math.min(audio.volume + step, target);
      if (audio.volume < target) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function fadeOutMusic(audio, step = 0.02) {
    function tick() {
      if (!audio) return;
      function run() {
        audio.volume = Math.max(audio.volume - step, 0);
        if (audio.volume > 0) requestAnimationFrame(run);
      }
      run();
    }
    tick();
  }

  /* ==========================================================================
     TYPING EFFECT ENGINE
     ========================================================================== */
  function typeTextHTML(element, html, speed = 35) {
    element.innerHTML = "";
    element.style.visibility = "visible";
    element.classList.add("type");

    const temp = document.createElement("div");
    temp.innerHTML = html;
    const chars = [];

    function flattenNodes(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        for (const c of node.textContent) chars.push(c);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        chars.push({ openTag: `<${node.tagName.toLowerCase()}>` });
        node.childNodes.forEach(flattenNodes);
        chars.push({ closeTag: `</${node.tagName.toLowerCase()}>` });
      }
    }

    temp.childNodes.forEach(flattenNodes);

    let i = 0;
    function typing() {
      if (i < chars.length) {
        const c = chars[i];
        if (typeof c === "string") {
          element.innerHTML += c;
        } else if (c.openTag) {
          element.innerHTML += c.openTag;
        } else if (c.closeTag) {
          element.innerHTML += c.closeTag;
        }
        i++;
        setTimeout(typing, speed);
      } else {
        element.classList.remove("type");
      }
    }
    typing();
  }

  /* ==========================================================================
     SCROLL ANIMATIONS (Fade Up & Slide)
     ========================================================================== */
  const faders = document.querySelectorAll(".fade-up, .fade-slide");

  const appearOnScroll = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  faders.forEach((f) => appearOnScroll.observe(f));

  /* ==========================================================================
     CONFESSION TRIGGER
     ========================================================================== */
  let confessStarted = false;

  if (confessSection) {
    const confessObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !confessStarted) {
            confessStarted = true;
            confessSection.classList.add("active");
            document.body.classList.add("calm");
            fadeOutMusic(music);

            let delay = 0;
            confessTexts.forEach((text) => {
              const original = text.innerHTML;
              setTimeout(() => typeTextHTML(text, original), delay);
              delay += original.replace(/<[^>]*>/g, "").length * 35 + 800;
            });
          }
        });
      },
      { threshold: 0.5 }
    );
    confessObserver.observe(confessSection);
  }

  /* ==========================================================================
     DARK MODE TOGGLE
     ========================================================================== */
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    if(toggleBtn) toggleBtn.textContent = "☀️";
  }

  toggleBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    toggleBtn.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  /* ==========================================================================
     SURPRISE BUTTON
     ========================================================================== */
  surpriseBtn?.addEventListener("click", () => {
    if (!surpriseText) return;
    surpriseText.classList.add("show");
    surpriseBtn.classList.add("hidden");
    surpriseBtn.style.display = "none";
  });

  /* ==========================================================================
     COUNTDOWN TIMER
     ========================================================================== */
  const targetDate = new Date("January 13, 2026 00:00:00").getTime();

  const updateCountdown = () => {
    const now = Date.now();
    const diff = targetDate - now;

    if (diff < 0) return;

    document.getElementById("days").textContent = Math.floor(diff / 86400000);
    document.getElementById("hours").textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0");
    document.getElementById("minutes").textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
    document.getElementById("seconds").textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
  };

  setInterval(updateCountdown, 1000);
  updateCountdown();

  /* ==========================================================================
     FLOATING ELEMENTS (Hearts & Bubbles)
     ========================================================================== */
  const createFloatingItem = (container, className, content = null) => {
    if (!container) return;
    
    const item = document.createElement("div");
    item.className = className;
    if (content) item.textContent = content;

    item.style.left = Math.random() * 100 + "vw";
    item.style.animationDuration = 8 + Math.random() * 6 + "s";
    
    if (className === "heart") {
      item.style.fontSize = 12 + Math.random() * 10 + "px";
    } else {
      const size = Math.random() * 20 + 10;
      item.style.width = item.style.height = size + "px";
    }

    container.appendChild(item);
    item.addEventListener("animationend", () => item.remove());
  };

  const heartsContainer = document.querySelector(".floating-hearts");
  setInterval(() => createFloatingItem(heartsContainer, "heart", Math.random() > 0.5 ? "🤍" : "💗"), 900);

  const bubblesContainer = document.querySelector(".floating-bubbles");
  setInterval(() => createFloatingItem(bubblesContainer, "bubble"), 600);
});