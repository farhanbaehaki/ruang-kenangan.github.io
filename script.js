document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const confessSection = document.getElementById("confess");
  const confessTexts = document.querySelectorAll(".confess-text");
  const music = document.getElementById("music");
  const startBtn = document.getElementById("startBtn");
  const toggleBtn = document.getElementById("themeToggle");
  const surpriseBtn = document.querySelector(".surprise");
  const surpriseText = document.getElementById("surpriseText");
  const absurdEmojis = ["🗿", "🦖", "👽", "🐸", "🤡", "👺", "🍄", "💩", "🦕", "💨"];

  /* ==========================================================================
      SURPRISE LOGIC (Combined & Cleaned)
     ========================================================================== */
  if (surpriseBtn) {
    surpriseBtn.addEventListener("click", () => {
      // 1. Sembunyikan tombol
      surpriseBtn.style.opacity = "0";
      setTimeout(() => {
        surpriseBtn.style.display = "none";
      }, 300);

      // 2. Munculkan container Review Jujur
      if (surpriseText) {
        surpriseText.style.display = "block";
        setTimeout(() => {
          surpriseText.classList.add("reveal");
          surpriseText.classList.add("show"); // Memastikan opacity 1 dari CSS faders
          surpriseText.style.opacity = "1";
        }, 50);
      }

      // 3. Hujan Emoji
      for (let i = 0; i < 50; i++) {
        setTimeout(createFallingEmoji, i * 100);
      }
    });
  }

  function createFallingEmoji() {
    const emoji = document.createElement("div");
    emoji.className = "falling-emoji";
    emoji.textContent = absurdEmojis[Math.floor(Math.random() * absurdEmojis.length)];
    emoji.style.left = Math.random() * 100 + "vw";
    emoji.style.position = "fixed";
    emoji.style.top = "-50px";
    emoji.style.zIndex = "9999";
    emoji.style.fontSize = Math.random() * 20 + 20 + "px";
    emoji.style.pointerEvents = "none";
    const duration = Math.random() * 3 + 2;
    emoji.style.animation = `fall ${duration}s linear forwards`;
    document.body.appendChild(emoji);
    setTimeout(() => emoji.remove(), duration * 1000);
  }

  /* ==========================================================================
      POLAROID & LIGHTBOX
     ========================================================================== */
  const polaroids = document.querySelectorAll('.polaroid');
  const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('show');
      }
    });
  }, { threshold: 0.1 });

  polaroids.forEach((item) => {
    const randomRot = (Math.random() * 12 - 6).toFixed(2);
    item.style.setProperty('--rotation', `${randomRot}deg`);
    
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const overlay = document.createElement('div');
      overlay.className = 'lightbox';
      overlay.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
      document.body.appendChild(overlay);
      overlay.addEventListener('click', () => overlay.remove());
    });
    galleryObserver.observe(item);
  });

  /* ==========================================================================
      MUSIC & TYPING EFFECT
     ========================================================================== */
  if (music) music.volume = 0;

  startBtn?.addEventListener("click", async () => {
    try {
      await music.play();
      fadeInMusic(music, 0.6, 0.02);
      // Optional: Scroll otomatis ke section berikutnya setelah klik start
      window.scrollBy(0, 500);
    } catch (err) {
      console.log("Autoplay diblokir");
    }
  });

  function fadeInMusic(audio, target = 0.6, step = 0.02) {
    let vol = 0;
    const interval = setInterval(() => {
      if (vol < target) {
        vol += step;
        audio.volume = Math.min(vol, target);
      } else {
        clearInterval(interval);
      }
    }, 50);
  }

  function fadeOutMusic(audio, step = 0.02) {
    const interval = setInterval(() => {
      if (audio.volume > 0.02) {
        audio.volume -= step;
      } else {
        audio.volume = 0;
        clearInterval(interval);
      }
    }, 50);
  }

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
        if (typeof c === "string") element.innerHTML += c;
        else if (c.openTag) element.innerHTML += c.openTag;
        else if (c.closeTag) element.innerHTML += c.closeTag;
        i++;
        setTimeout(typing, speed);
      } else {
        element.classList.remove("type");
      }
    }
    typing();
  }

  /* ==========================================================================
      SCROLL OBSERVERS
     ========================================================================== */
  const faders = document.querySelectorAll(".fade-up, .fade-slide");
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  faders.forEach((f) => appearOnScroll.observe(f));

  let confessStarted = false;
  if (confessSection) {
    const confessObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !confessStarted) {
          confessStarted = true;
          fadeOutMusic(music);
          let delay = 0;
          confessTexts.forEach((text) => {
            const original = text.innerHTML;
            text.innerHTML = "";
            setTimeout(() => typeTextHTML(text, original), delay);
            delay += original.replace(/<[^>]*>/g, "").length * 35 + 1000;
          });
        }
      });
    }, { threshold: 0.5 });
    confessObserver.observe(confessSection);
  }

  /* ==========================================================================
      DARK MODE & COUNTDOWN
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
      FLOATING ITEMS
     ========================================================================== */
  const createFloatingItem = (container, className, content = null) => {
    if (!container) return;
    const item = document.createElement("div");
    item.className = className;
    if (content) item.textContent = content;
    item.style.left = Math.random() * 100 + "vw";
    item.style.animationDuration = 8 + Math.random() * 6 + "s";
    if (className === "heart") item.style.fontSize = 12 + Math.random() * 10 + "px";
    else item.style.width = item.style.height = (Math.random() * 20 + 10) + "px";
    container.appendChild(item);
    item.addEventListener("animationend", () => item.remove());
  };

  setInterval(() => createFloatingItem(document.querySelector(".floating-hearts"), "heart", Math.random() > 0.5 ? "🤍" : "💗"), 1000);
  setInterval(() => createFloatingItem(document.querySelector(".floating-bubbles"), "bubble"), 800);
});