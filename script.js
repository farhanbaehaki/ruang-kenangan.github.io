document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
      1. LOADING SCREEN LOGIC
     ========================================================================== */
  const loader = document.getElementById("loader");
  const loaderText = document.getElementById("loaderText");
  const messages = ["Menyiapkan kejutan...", "Mengumpulkan momen indah...", "Sedikit lagi...", "Siap!"];
  
  let msgIndex = 0;
  const msgInterval = setInterval(() => {
    if (msgIndex < messages.length) {
      if(loaderText) loaderText.textContent = messages[msgIndex];
      msgIndex++;
    }
  }, 800);

  // Menghilangkan loader setelah semua asset (gambar/musik) termuat
  window.addEventListener("load", () => {
    setTimeout(() => {
      clearInterval(msgInterval);
      if(loader) {
        loader.classList.add("fade-out");
        // Hapus elemen dari DOM setelah animasi selesai agar tidak menghalangi klik
        setTimeout(() => loader.style.display = "none", 800);
      }
    }, 2500); 
  });

  /* ==========================================================================
      2. DOM ELEMENTS & INITIAL STATE
     ========================================================================== */
  const confessSection = document.getElementById("confess");
  const confessTexts = document.querySelectorAll(".confess-text");
  const music = document.getElementById("music");
  const startBtn = document.getElementById("startBtn");
  const toggleBtn = document.getElementById("themeToggle");
  const surpriseBtn = document.querySelector(".surprise");
  const surpriseText = document.getElementById("surpriseText");
  const absurdEmojis = ["🗿", "🦖", "👽", "🐸", "🤡", "👺", "🍄", "💩", "🦕", "💨"];

  if (music) music.volume = 0;

  /* ==========================================================================
      3. MUSIC & START BUTTON
     ========================================================================== */
  startBtn?.addEventListener("click", async () => {
    try {
      await music.play();
      fadeInMusic(music, 0.6, 0.02);
      // Scroll halus ke bawah sedikit setelah klik mulai
      window.scrollBy({ top: 400, behavior: 'smooth' });
    } catch (err) {
      console.log("Autoplay diblokir browser, butuh interaksi user.");
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

  /* ==========================================================================
      4. TYPING EFFECT ENGINE (Supports HTML Tags)
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
      5. SCROLL OBSERVERS (Animations & Confess)
     ========================================================================== */
  const faders = document.querySelectorAll(".fade-up, .fade-slide");
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  faders.forEach((f) => appearOnScroll.observe(f));

  let confessStarted = false;
  if (confessSection) {
    const confessObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !confessStarted) {
          confessStarted = true;
          let delay = 0;
          confessTexts.forEach((text) => {
            const original = text.innerHTML;
            text.innerHTML = "";
            setTimeout(() => typeTextHTML(text, original), delay);
            // Kalkulasi delay agar teks muncul bergantian setelah yang sebelumnya selesai
            delay += original.replace(/<[^>]*>/g, "").length * 35 + 1000;
          });
        }
      });
    }, { threshold: 0.5 });
    confessObserver.observe(confessSection);
  }

  /* ==========================================================================
      6. SURPRISE, GALLERY, & THEME
     ========================================================================== */
  if (surpriseBtn) {
    surpriseBtn.addEventListener("click", () => {
      surpriseBtn.style.opacity = "0";
      setTimeout(() => {
        surpriseBtn.style.display = "none";
        if (surpriseText) {
          surpriseText.style.display = "block";
          setTimeout(() => {
            surpriseText.classList.add("reveal");
            surpriseText.style.opacity = "1";
          }, 50);
        }
      }, 300);
      for (let i = 0; i < 50; i++) setTimeout(createFallingEmoji, i * 100);
    });
  }

  function createFallingEmoji() {
    const emoji = document.createElement("div");
    emoji.className = "falling-emoji";
    emoji.textContent = absurdEmojis[Math.floor(Math.random() * absurdEmojis.length)];
    emoji.style.left = Math.random() * 100 + "vw";
    document.body.appendChild(emoji);
    const duration = Math.random() * 3 + 2;
    emoji.style.animation = `fall ${duration}s linear forwards`;
    setTimeout(() => emoji.remove(), duration * 1000);
  }

  // Polaroid Gallery Logic
  document.querySelectorAll('.polaroid').forEach((item) => {
    // Set rotasi acak untuk estetika
    item.style.setProperty('--rotation', `${(Math.random() * 12 - 6).toFixed(2)}deg`);
    
    // Lightbox klik foto
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const overlay = document.createElement('div');
      overlay.className = 'lightbox';
      overlay.innerHTML = `<img src="${img.src}" alt="Momen Naura">`;
      document.body.appendChild(overlay);
      overlay.addEventListener('click', () => overlay.remove());
    });
  });

  /* ==========================================================================
      7. COUNTDOWN & FLOATING DECORATIONS
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

  // Floating Hearts & Bubbles
  const createFloatingItem = (container, className, content = null) => {
    if (!container) return;
    const item = document.createElement("div");
    item.className = className;
    if (content) item.textContent = content;
    item.style.left = Math.random() * 100 + "vw";
    item.style.animationDuration = 8 + Math.random() * 6 + "s";
    container.appendChild(item);
    item.addEventListener("animationend", () => item.remove());
  };

  setInterval(() => createFloatingItem(document.querySelector(".floating-hearts"), "heart", Math.random() > 0.5 ? "🤍" : "💗"), 1000);
  setInterval(() => createFloatingItem(document.querySelector(".floating-bubbles"), "bubble"), 800);

  // Theme Toggle Logic
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
});

// Memaksa halaman kembali ke atas saat direfresh
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};