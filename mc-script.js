let currentStep = 0;

const splashes = [
  "Happy Birthday, Naura!",
  "The Best Player!",
  "LDR is just a number!",
  "Level 19 Unlocked!",
  "Made with Love!",
];

// 1. Fungsi Utama (Gabungan & Diperbaiki)
function startQuest() {
  const overlay = document.getElementById("start-overlay");
  const world = document.querySelector(".mc-world");
  const video = document.getElementById("mc-bg-video");
  const bgm = document.getElementById("bgm");

  // Kontrol Media
  if (video) {
    video.muted = true;
    video.play().catch((e) => console.log("Video pending"));
  }

  if (bgm) {
    bgm.volume = 0.3;
    bgm.play().catch((e) => console.log("Audio diblokir"));
  }

  // Transisi UI
  overlay.style.opacity = "0";
  setTimeout(() => {
    overlay.style.display = "none";
    world.style.opacity = "1";
    refreshHotbar();
    
    // Antrian Chat ala Minecraft
    sendMcChat("Welcome back, Naura!");
    setTimeout(() => {
      sendMcChat("Server version 13.0.1");
    }, 1500);

  }, 800);

  const splashElement = document.getElementById("splash");
  if (splashElement) {
    splashElement.innerText = splashes[Math.floor(Math.random() * splashes.length)];
  }
}

// 2. Logika Update Hotbar & Tooltip
function refreshHotbar() {
  const hotbar = document.getElementById("main-hotbar");
  if (!hotbar) return;

  hotbar.innerHTML = "";
  const path = "assets/photos/";

  if (currentStep === 0) {
    hotbar.innerHTML = `<div class="mc-slot" onclick="actionEat()"><img src="${path}cake.gif"></div>`;
    showItemName("Birthday Cake");
  } else if (currentStep === 1 || currentStep === 2) {
    hotbar.innerHTML = `<div class="mc-slot" onclick="actionDiamond()"><img src="${path}gift1.png" onerror="this.src='https://minecraft.wiki/images/Filled_Chest_JE2_BE2.png'"></div>`;
    showItemName("Mysterious Gift");
  } else if (currentStep === 3) {
    hotbar.innerHTML = `<div class="mc-slot" onclick="actionFinal()"><img src="${path}diamond1.jpg" onerror="this.src='https://minecraft.wiki/images/Diamond_JE3_BE3.png'"></div>`;
    showItemName("The Eternal Diamond");
  }
}

function showItemName(name) {
  const el = document.getElementById("item-name");
  if (!el) return;
  el.innerText = name;
  el.style.opacity = "1";
  if (window.itemTimeout) clearTimeout(window.itemTimeout);
  window.itemTimeout = setTimeout(() => {
    el.style.opacity = "0";
  }, 2000);
}

// 3. Aksi Game
function actionEat() {
  playMcSfx("sfx-click");
  currentStep = 1;
  showMcAdvancement("Sweet 19!", "Kue dimakan. Hadiah muncul!");
  refreshHotbar();
}

function actionDiamond() {
  playMcSfx("sfx-click");
  showMcModal(
    "Crystal of Memory",
    "Jarak bukan halangan bagi pemain hebat. <br><br><b>Misi: </b> Klik tombol CREATIVE MODE dan masukkan kode rahasia."
  );
  currentStep = 2;
  const btn = document.getElementById("btn-creative");
  if (btn) {
    btn.classList.remove("locked");
    btn.innerHTML = "CREATIVE MODE 🔓";
  }
}

function questAction(type) {
  playMcSfx("sfx-click");

  if (type === "survival") {
    showMcModal("Survival Mode", "Kamu telah bertahan di server ini selama 19 tahun dengan sangat baik!");
  } else if (type === "creative") {
    if (currentStep < 2) {
      showMcModal("LOCKED", "Selesaikan misi di Hotbar terlebih dahulu!");
      return;
    }

    let code = prompt("Masukkan Passcode (hari ini???):");
    if (code === "13012026") {
      playMcSfx("sfx-level");
      currentStep = 3;
      showMcAdvancement("The Architect", "Akses Berlian telah terbuka!");
      refreshHotbar();
    } else if (code !== null) {
      const world = document.querySelector(".mc-world");
      world.classList.add("shake-effect");
      setTimeout(() => world.classList.remove("shake-effect"), 500);

      playMcSfx("sfx-click");
      showMcModal("SECURITY ALERT", "Naura fell from a high place (Wrong Password!). <br><br> Hint: your special day");
    }
  }
}

function actionFinal() {
  playMcSfx("sfx-level");
  
  confetti({ 
    particleCount: 150, 
    spread: 70, 
    origin: { y: 0.6 },
    colors: ['#b350ff', '#ffff55', '#55ff55'] 
  });

  // Desain Voucher ala Minecraft Tooltip (Legendary Purple)
  showMcModal(
    "⭐ MISSION ACCOMPLISHED ⭐",
    `<div style="
        background: rgba(16, 1, 32, 0.95); 
        border: 3px solid #b350ff; 
        padding: 20px; 
        margin: 10px 0; 
        border-radius: 2px; 
        box-shadow: 6px 6px 0px rgba(0,0,0,0.5);
        text-align: left;
        position: relative;">
        
        <h4 style="color: #b350ff; margin: 0 0 10px 0; font-size: 14px; text-shadow: 2px 2px #000;">[ Legendary Voucher ]</h4>
        
        <div style="color: #ffffff; font-size: 11px; line-height: 1.8; text-shadow: 1px 1px #000;">
          <span style="color: #55ff55;">+ Unlimited</span> <b>Makan Enak</b><br>
          <span style="color: #55ff55;">+ Unlimited</span> <b>Ngopi/Matcha Date</b><br>
          <span style="color: #55ff55;">+ 100%</span> <b>Deep Talk Buff</b>
        </div>

        <div style="margin-top: 15px; border-top: 2px solid #373737; padding-top: 10px;">
          <p style="color: #aaa; font-size: 9px; font-style: italic; margin: 0;">
            "Item ini sangat langka. Gunakan untuk memulihkan energi dan mood Naura kapan saja."
          </p>
        </div>

        <div style="
            position: absolute; 
            top: 10px; 
            right: 10px; 
            font-size: 20px; 
            opacity: 0.8;
            animation: bounce 1s infinite alternate;">🎫</div>
     </div>
     
     <p style="font-size: 10px; color: #333; font-weight: bold; background: #ffff55; display: inline-block; padding: 2px 8px; margin-top: 10px;">
        SCREENSHOT TO CLAIM
     </p>`
  );
}
// Helpers
function playMcSfx(id) {
  const sfx = document.getElementById(id);
  if (sfx) {
    sfx.currentTime = 0;
    sfx.play().catch(() => {});
  }
}

function showMcModal(title, desc) {
  document.getElementById("modal-title").innerText = title;
  document.getElementById("modal-desc").innerHTML = desc;
  document.getElementById("mc-modal").style.display = "flex";
}

function closeMcModal() {
  document.getElementById("mc-modal").style.display = "none";
}

function showMcAdvancement(title, msg) {
  const adv = document.getElementById("adv-pop");
  const advTitle = document.getElementById("adv-title");
  if (adv && advTitle) {
    advTitle.innerText = title;
    adv.classList.add("show");
    setTimeout(() => adv.classList.remove("show"), 4500);
  }
}

function sendMcChat(message) {
  const container = document.getElementById("mc-chat-container");
  if (!container) return;
  const chatLine = document.createElement("div");
  chatLine.className = "chat-line"; 
  chatLine.innerHTML = `<span style="color: #aaa;">[Server]</span> ${message}`;
  container.appendChild(chatLine);
  setTimeout(() => {
    chatLine.style.opacity = "0";
    setTimeout(() => chatLine.remove(), 1000);
  }, 6000);
}

document.addEventListener("DOMContentLoaded", refreshHotbar);