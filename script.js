document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
       2. MUSIC & START BUTTON
       ========================================================================== */
  const startBtn = document.getElementById("startBtn");
  const music = document.getElementById("music");

  if (startBtn) {
    startBtn.addEventListener("click", async () => {
      try {
        if (music) {
          music.volume = 0;
          await music.play();
          fadeInMusic(music, 0.6, 0.02);
        }
        // Scroll ke section berikutnya
        window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
      } catch (err) {
        console.log("Autoplay diblokir browser.");
      }
    });
  }

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
       3. SURPRISE & EMOJI FALL
       ========================================================================== */
  const surpriseBtn = document.querySelector(".surprise");
  const surpriseText = document.getElementById("surpriseText");

  if (surpriseBtn) {
    surpriseBtn.addEventListener("click", () => {
      surpriseBtn.style.transform = "scale(0.9)";
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

      // Munculkan Hujan Emoji
      createEmojiFall();
    });
  }

  function createEmojiFall() {
    const emojis = ["💖", "✨", "🎂", "🌸", "🎈", "🥳", "🤍", "💗"];
    for (let i = 0; i < 40; i++) {
      setTimeout(() => {
        const emoji = document.createElement("div");
        emoji.className = "falling-emoji";
        emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = Math.random() * 100 + "vw";
        emoji.style.animationDuration = Math.random() * 3 + 2 + "s";
        emoji.style.fontSize = Math.random() * 20 + 20 + "px";
        document.body.appendChild(emoji);
        setTimeout(() => emoji.remove(), 5000);
      }, i * 100);
    }
  }

  /* ==========================================================================
       4. TYPING EFFECT ENGINE
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
       5 & 6. OBSERVERS (POLAROID & TYPING TEXT) - FINAL FIX
     ========================================================================== */
  
  // 1. Inisialisasi awal Polaroid (Miringkan semua foto)
  document.querySelectorAll(".polaroid").forEach((item) => {
    const randomRotation = (Math.random() * 12 - 6).toFixed(2);
    item.style.setProperty("--rotation", `${randomRotation}deg`);

    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      if (img && img.src) {
        const overlay = document.createElement("div");
        overlay.className = "lightbox";
        overlay.innerHTML = `<img src="${img.src}" alt="Momen">`;
        document.body.appendChild(overlay);
        overlay.addEventListener("click", () => overlay.remove());
      }
    });
  });

  // 2. Observer Utama (Untuk Polaroid dan Fade-up)
  const faders = document.querySelectorAll(".fade-up, .fade-slide, .polaroid");
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  faders.forEach((f) => appearOnScroll.observe(f));

  // 3. Observer Khusus Text Confess (Efek Ngetik)
  const confessSection = document.getElementById("confess");
  const confessTexts = document.querySelectorAll(".confess-text");
  let confessStarted = false;

  if (confessSection && confessTexts.length > 0) {
    const confessObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Jika section confess terlihat 30% saja, mulai ngetik
        if (entry.isIntersecting && !confessStarted) {
          confessStarted = true;
          let delay = 0;
          
          confessTexts.forEach((text) => {
            const originalHTML = text.innerHTML;
            text.innerHTML = ""; // Kosongkan dulu
            
            setTimeout(() => {
              typeTextHTML(text, originalHTML);
            }, delay);
            
            // Hitung jeda untuk baris berikutnya (35ms per karakter + 1 detik jeda)
            delay += originalHTML.replace(/<[^>]*>/g, "").length * 35 + 1000;
          });
        }
      });
    }, { threshold: 0.3 }); // Turunkan threshold agar lebih sensitif

    confessObserver.observe(confessSection);
  }
  /* ==========================================================================
       7. DECORATIONS & THEME
       ========================================================================== */
  const createFloatingItem = (containerSelector, className, content = null) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const item = document.createElement("div");
    item.className = className;
    if (content) item.textContent = content;
    item.style.left = Math.random() * 100 + "vw";
    item.style.animationDuration = 8 + Math.random() * 6 + "s";
    container.appendChild(item);
    item.addEventListener("animationend", () => item.remove());
  };

  setInterval(
    () =>
      createFloatingItem(
        ".floating-hearts",
        "heart",
        Math.random() > 0.5 ? "🤍" : "💗"
      ),
    1000
  );
  setInterval(() => createFloatingItem(".floating-bubbles", "bubble"), 800);

  const toggleBtn = document.getElementById("themeToggle");
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    if (toggleBtn) toggleBtn.textContent = "☀️";
  }

  toggleBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    toggleBtn.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};
