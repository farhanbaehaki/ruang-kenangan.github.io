document.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById("music");
  const startBtn = document.getElementById("startBtn");
  const toggleBtn = document.getElementById("themeToggle");
  const envelope = document.getElementById("envelope");
  const letterText = document.getElementById("letterText");
  const hero = document.querySelector(".hero");

  /* MUSIC */
  if(music) music.volume = 0;
  startBtn?.addEventListener("click", async () => {
    try { await music.play(); fadeInMusic(music); } 
    catch { alert("Musik diblokir browser 😢"); }
  });
  function fadeInMusic(audio) {
    let vol = 0;
    const fade = setInterval(() => {
      vol += 0.02;
      audio.volume = Math.min(vol, 0.6);
      if(vol >= 0.6) clearInterval(fade);
    }, 120);
  }

  /* LETTER */
  if(envelope && letterText) {
    const fullText = letterText.innerHTML;
    letterText.innerHTML = "";
    let index = 0, started = false;
    envelope.addEventListener("click", () => {
      if(envelope.classList.contains("open")) return;
      envelope.classList.add("open");
      setTimeout(() => { if(started) return; started = true; typeWriter(); }, 900);
    });

    function typeWriter() {
      if(index >= fullText.length) { letterText.classList.remove("type-caret"); return; }
      letterText.classList.add("type-caret");
      if(fullText[index] === "<") {
        const tagEnd = fullText.indexOf(">", index);
        const tag = fullText.substring(index, tagEnd+1);
        letterText.innerHTML += tag;
        index = tagEnd+1;
        if(tag === "<br>" && fullText.substring(index, index+4) === "<br>") {
          letterText.innerHTML += "<br"; index += 4;
          setTimeout(typeWriter, 800); return;
        }
        setTimeout(typeWriter, 0); return;
      }
      const char = fullText.charAt(index);
      letterText.innerHTML += char;
      index++;
      let delay = 35; if(char === ",") delay = 120; if(char === ".") delay = 240;
      setTimeout(typeWriter, delay);
    }
  }

  /* SCROLL REVEAL */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add("show"); });
  }, { threshold: 0.15 });
  document.querySelectorAll(".fade-up, .fade-slide").forEach(el => revealObserver.observe(el));

  /* DARK MODE */
  function applyTheme(isDark) {
    document.body.classList.toggle("dark", isDark);
    toggleBtn.textContent = isDark ? "☀️" : "🌙";
    // update hero gradient
    if(hero) {
      hero.style.setProperty('--hero-gradient', isDark 
        ? 'linear-gradient(120deg, #1a1a1a, #2a2a2a, #121212, #2a2a2a, #1a1a1a)' 
        : 'linear-gradient(120deg, #dceeff, #a0d8ff, #ffffff, #c4e0ff, #dceeff)');
      hero.style.background = 'var(--hero-gradient)';
    }
  }

  toggleBtn?.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark");
    applyTheme(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  if(localStorage.getItem("theme") === "dark") applyTheme(true);

  /* SURPRISE */
  window.showSurprise = () => {
    const text = document.getElementById("surpriseText");
    const btn = document.querySelector(".surprise");
    if(!text) return;
    text.classList.add("show");
    btn && (btn.style.display = "none");
  }
});

/* COUNTDOWN */
const targetDate = new Date("January 13, 2026 00:00:00").getTime();
setInterval(() => {
  const now = Date.now();
  const d = targetDate - now;
  if(d < 0) return;
  document.getElementById("days").textContent = Math.floor(d/86400000);
  document.getElementById("hours").textContent = Math.floor(d/3600000)%24;
  document.getElementById("minutes").textContent = Math.floor(d/60000)%60;
  document.getElementById("seconds").textContent = Math.floor(d/1000)%60;
}, 1000);

/* FLOATING HEARTS */
const heartsContainer = document.querySelector(".floating-hearts");
if(heartsContainer){setInterval(()=>{
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = Math.random() > 0.5 ? "🤍" : "💗";
  heart.style.left = Math.random()*100+"vw";
  heart.style.animationDuration = 8 + Math.random()*6 +"s";
  heart.style.fontSize = 12 + Math.random()*10 +"px";
  heartsContainer.appendChild(heart);
  setTimeout(()=>heart.remove(),14000);
},900);}

/* FLOATING BUBBLES */
const bubblesContainer = document.querySelector(".floating-bubbles");
setInterval(()=>{
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  const size = Math.random()*20+10;
  bubble.style.width = bubble.style.height = size+"px";
  bubble.style.left = Math.random()*100+"vw";
  bubble.style.animationDuration = 8 + Math.random()*6 +"s";
  bubblesContainer.appendChild(bubble);
  setTimeout(()=>bubble.remove(),14000);
},600);
