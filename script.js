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
      fadeInMusic(music, 0.6, 120);
    } catch {
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
      audio.volume = Math.max(audio.volume - step, 0);
      if (audio.volume > 0) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ================= TYPING EFFECT SUPPORT HTML ================= */
  function typeTextHTML(element, html, speed = 35) {
    element.innerHTML = "";
    element.style.visibility = "visible";
    element.classList.add("type"); // cursor effect

    const temp = document.createElement("div");
    temp.innerHTML = html;
    const chars = [];
    
    function flattenNodes(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        for (const char of node.textContent) chars.push(char);
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
      } else element.classList.remove("type");
    }
    typing();
  }

  /* ================= SCROLL FADE-UP ================= */
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
            fadeOutMusic(music);

            let delay = 0;
            confessTexts.forEach(text => {
              const original = text.innerHTML;
              setTimeout(() => typeTextHTML(text, original), delay);
              delay += original.replace(/<[^>]*>/g,"").length * 35 + 600;
            });
          }
        });
      }, { threshold: 0.7 }
    );
    confessObserver.observe(confessSection);
  }

  /* ================= DARK MODE ================= */
  document.body.style.transition = "background 0.6s, color 0.6s"; // smooth transition
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
    surpriseBtn.classList.add("hidden");
  });

  /* ================= COUNTDOWN ================= */
  const targetDate = new Date("January 13, 2026 00:00:00").getTime();
  const countdown = () => {
    const now = Date.now();
    const d = targetDate - now;
    if (d < 0) return;
    document.getElementById("days").textContent = Math.floor(d / 86400000);
    document.getElementById("hours").textContent = String(Math.floor(d / 3600000) % 24).padStart(2,'0');
    document.getElementById("minutes").textContent = String(Math.floor(d / 60000) % 60).padStart(2,'0');
    document.getElementById("seconds").textContent = String(Math.floor(d / 1000) % 60).padStart(2,'0');
  };
  setInterval(countdown, 1000);
  countdown();

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
      heart.addEventListener("animationend", () => heart.remove());
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
      bubble.addEventListener("animationend", () => bubble.remove());
    }, 600);
  }

});
