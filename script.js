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
       SURPRISE BUTTON + HUJAN EMOJI
       ========================================================================== */
if (surpriseBtn) {
    surpriseBtn.addEventListener("click", () => {
        console.log("Tombol diklik!"); 

        // 1. Munculkan container utama
        if (surpriseText) {
            surpriseText.style.display = "block"; // Aktifkan display dulu
            
            // Beri jeda sangat singkat (50ms) agar browser sempat memproses 'display block'
            // baru kemudian tambahkan class 'reveal' untuk memicu animasi staggered di CSS
            setTimeout(() => {
                surpriseText.classList.add("reveal");
                surpriseText.style.opacity = "1";
            }, 50);
        }

        // 2. Sembunyikan tombol dengan efek halus
        surpriseBtn.style.opacity = "0";
        setTimeout(() => {
            surpriseBtn.style.display = "none";
        }, 300);

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

        setTimeout(() => {
            emoji.remove();
        }, duration * 1000);
    }

  /* ==========================================================================
     GALLERY WITH RANDOM ROTATION (POLAROID VERSION)
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
    // Memberikan rotasi acak
    const randomRot = (Math.random() * 12 - 6).toFixed(2);
    item.style.setProperty('--rotation', `${randomRot}deg`);
    
    // Lightbox klik
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

   let confessStarted = false;

  if (confessSection) {

    confessTexts.forEach((text) => {
      text.style.visibility = "hidden"; 
    });

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
              text.innerHTML = "";
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