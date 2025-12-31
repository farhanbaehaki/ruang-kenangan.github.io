document.addEventListener("DOMContentLoaded", () => {

/* ==========================================================================
     1. LOADER & TEXT CHANGER
     ========================================================================== */
  const loader = document.getElementById('loader');
  const loaderText = document.getElementById('loader-text');
  const messages = [
    "Menyiapkan sesuatu yang manis...",
    "Mengumpulkan kenangan indah...",
    "Menyusun kejutan untukmu...",
    "Hampir siap! ❤️"
  ];
  
  let msgIndex = 0;
  const textInterval = setInterval(() => {
    msgIndex++;
    if (messages[msgIndex] && loaderText) {
      loaderText.style.opacity = 0;
      setTimeout(() => {
        loaderText.textContent = messages[msgIndex];
        loaderText.style.opacity = 1;
      }, 500);
    }
  }, 1100);

  window.addEventListener('load', () => {
    setTimeout(() => {
      clearInterval(textInterval);
      if(loader) loader.classList.add('fade-out');
    }, 4500);
  });

  /* ==========================================================================
       2. MUSIC & START BUTTON
       ========================================================================== */
  const startBtn = document.getElementById("startBtn");
  const music = document.getElementById("music");

if (startBtn) {
  startBtn.addEventListener("click", async () => {
    try {
      if (music && music.paused) { // Tambahkan pengecekan paused agar tidak main double
        music.volume = 0;
        await music.play();
        fadeInMusic(music, 0.6, 0.02);
      }
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
function typeTextHTML(element, html, speed = 60) {
  return new Promise((resolve) => {
    element.innerHTML = "";
    element.style.visibility = "visible";
    element.style.opacity = "1";
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

        // --- POLASAN: Kecepatan Natural ---
        let currentSpeed = speed + (Math.random() * 40 - 20); 
        
        // Logika Jeda Tanda Baca yang Lebih Detail
        if (typeof c === "string") {
          if (c === ".") {
            currentSpeed = 800; // Berhenti lama di akhir kalimat (titik)
          } else if (c === "," || c === "-" || c === ":") {
            currentSpeed = 400; // Berhenti sejenak di koma atau jeda kalimat
          }
        }

        setTimeout(typing, currentSpeed);
      } else {
        setTimeout(() => {
          element.classList.remove("type");
          resolve();
        }, 800); // Beri jeda sedikit sebelum lanjut ke paragraf berikutnya
      }
    }
    typing();
  });
}
  /* ==========================================================================
       5. OBSERVERS (PHOTO & TEXT)
       ========================================================================== */
  const faders = document.querySelectorAll(".fade-up, .fade-slide, .polaroid");
  const appearOnScroll = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  faders.forEach((f) => appearOnScroll.observe(f));

  const confessSection = document.getElementById("confess");
  const confessTexts = document.querySelectorAll(".confess-text");
  let confessStarted = false;

if (confessSection) {
  const confessObserver = new IntersectionObserver(
    async (entries) => { // Perhatikan tambahan 'async' di sini
      for (const entry of entries) {
        if (entry.isIntersecting && !confessStarted) {
          confessStarted = true;
          
          // Gunakan for...of agar bisa menggunakan 'await'
          for (const text of confessTexts) {
            const original = text.innerHTML;
            
            // Sembunyikan teks asli
            text.style.opacity = "0";
            text.style.visibility = "visible";

            // Tunggu sampai fungsi pengetik selesai sepenuhnya
            await typeTextHTML(text, original);
            
            // Beri jeda 1 detik (1000ms) sebelum paragraf berikutnya mulai diketik
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
    },
    { threshold: 0.2 }
  );
  confessObserver.observe(confessSection);
}

  /* ==========================================================================
       6. GALLERY LIGHTBOX & COUNTDOWN
       ========================================================================== */
  document.querySelectorAll(".polaroid").forEach((item) => {
    item.style.setProperty(
      "--rotation",
      `${(Math.random() * 12 - 6).toFixed(2)}deg`
    );
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

  const targetDate = new Date("January 13, 2026 00:00:00").getTime();
  function updateCountdown() {
    const diff = targetDate - Date.now();
    if (diff < 0) return;
    document.getElementById("days").textContent = Math.floor(diff / 86400000);
    document.getElementById("hours").textContent = String(
      Math.floor((diff % 86400000) / 3600000)
    ).padStart(2, "0");
    document.getElementById("minutes").textContent = String(
      Math.floor((diff % 3600000) / 60000)
    ).padStart(2, "0");
    document.getElementById("seconds").textContent = String(
      Math.floor((diff % 60000) / 1000)
    ).padStart(2, "0");
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

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