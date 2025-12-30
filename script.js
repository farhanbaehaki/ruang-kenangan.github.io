document.addEventListener("DOMContentLoaded", () => {
  const confessSection = document.getElementById("confess");
  const confessTexts = document.querySelectorAll(".confess-text");
  const music = document.getElementById("music");
  const startBtn = document.getElementById("startBtn");
  const toggleBtn = document.getElementById("themeToggle");
  const surpriseBtn = document.querySelector(".surprise");
  const surpriseText = document.getElementById("surpriseText");

  /* ===================================================
     GALLERY LOGIC
     =================================================== */
  const galleryImgs = document.querySelectorAll(".gallery img");

 const galleryObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      // isIntersecting sering telat di mobile, kita tambah cek intersectionRatio
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { 
    threshold: 0, // 0 berarti asal tersentuh 1 pixel pun langsung muncul
    rootMargin: "200px 0px" // "Panggil" gambar saat user masih 200px di atasnya
  }
);

  galleryImgs.forEach((img, i) => {
    img.style.setProperty("--i", i);
    
    // Lightbox effect
    img.addEventListener("click", () => {
      const overlay = document.createElement("div");
      overlay.className = "lightbox";
      overlay.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
      document.body.appendChild(overlay);
      overlay.addEventListener("click", () => overlay.remove());
    });
    
    galleryObserver.observe(img);
  });

  /* ===================================================
     MUSIC CONTROL (Fade In/Out)
     =================================================== */
  if (music) music.volume = 0;

  startBtn?.addEventListener("click", async () => {
    try {
      await music.play();
      fadeInMusic(music, 0.6, 0.02);
      startBtn.innerText = "Scroll pelan-pelan yaa... ✨";
      startBtn.style.opacity = "0.6";
    } catch (err) {
      console.error("Autoplay diblokir:", err);
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
      audio.volume = Math.max(audio.volume - step, 0);
      if (audio.volume > 0) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ===================================================
     TYPING EFFECT ENGINE
     =================================================== */
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

  /* ===================================================
     SCROLL ANIMATIONS (Fade Up)
     =================================================== */
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
    { threshold: 0.2 } // Diperkecil agar lebih mudah muncul di HP
  );

  faders.forEach((f) => appearOnScroll.observe(f));

  /* ===================================================
     CONFESS SECTION TRIGGER
     =================================================== */
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
              // Kalkulasi delay berdasarkan panjang teks agar tidak tumpang tindih
              delay += original.replace(/<[^>]*>/g, "").length * 35 + 800;
            });
          }
        });
      },
      { threshold: 0.5 }
    );
    confessObserver.observe(confessSection);
  }

  /* ===================================================
     DARK MODE TOGGLE
     =================================================== */
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "dark") {
    document.body.classList.add("dark");
    toggleBtn.textContent = "☀️";
  }

  toggleBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    toggleBtn.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  /* ===================================================
     COUNTDOWN TIMER
     =================================================== */
  const targetDate = new Date("January 13, 2026 00:00:00").getTime();
  
  const updateCountdown = () => {
    const now = Date.now();
    const diff = targetDate - now;

    if (diff < 0) return;

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);

    document.getElementById("days").textContent = d;
    document.getElementById("hours").textContent = String(h).padStart(2, "0");
    document.getElementById("minutes").textContent = String(m).padStart(2, "0");
    document.getElementById("seconds").textContent = String(s).padStart(2, "0");
  };

  setInterval(updateCountdown, 1000);
  updateCountdown();

  /* ===================================================
     FLOATING ELEMENTS (Hearts & Bubbles)
     =================================================== */
  const createFloatingItem = (container, className, isHeart = true) => {
    if (!container) return;
    const item = document.createElement("div");
    item.className = className;
    
    if (isHeart) {
      item.textContent = Math.random() > 0.5 ? "🤍" : "💗";
      item.style.fontSize = Math.random() * 10 + 12 + "px";
    } else {
      const size = Math.random() * 20 + 10;
      item.style.width = item.style.height = size + "px";
    }

    item.style.left = Math.random() * 100 + "vw";
    item.style.animationDuration = Math.random() * 6 + 8 + "s";
    
    container.appendChild(item);
    item.addEventListener("animationend", () => item.remove());
  };

  setInterval(() => createFloatingItem(document.querySelector(".floating-hearts"), "heart", true), 1000);
  setInterval(() => createFloatingItem(document.querySelector(".floating-bubbles"), "bubble", false), 800);

  /* ===================================================
     SURPRISE BUTTON
     =================================================== */
  surpriseBtn?.addEventListener("click", () => {
    surpriseText?.classList.add("show");
    surpriseBtn.style.display = "none";
  });

  // Emergency Fallback: Paksa tampilkan galeri jika dalam 3 detik belum muncul
  setTimeout(() => {
    galleryImgs.forEach(img => img.classList.add("show"));
  }, 4000);
});

// Paksa semua gambar muncul jika user menggunakan HP (deteksi layar kecil)
if (window.innerWidth < 768) {
  setTimeout(() => {
    document.querySelectorAll(".gallery img").forEach(img => {
      img.classList.add("show");
    });
  }, 1000); // Munculkan semua gambar setelah 1 detik halaman dimuat
}