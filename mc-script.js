let currentStep = 0;

const splashes = [
  "Happy Birthday, Naura!",
  "The Best Player!",
  "LDR is just a number!",
  "Level 19 Unlocked!",
  "Made with Love!",
];

// 1. Fungsi Utama saat Klik "TAP TO JOIN WORLD"
function startQuest() {
  const overlay = document.getElementById("start-overlay");
  const world = document.querySelector(".mc-world");
  const video = document.getElementById("mc-bg-video");
  const bgm = document.getElementById("bgm");

  if (video) {
    video.muted = true;
    video.play().catch((e) => console.log("Video play dipending"));
  }

  if (bgm) {
    bgm.volume = 0.3;
    bgm.play().catch((e) => console.log("Audio diblokir"));
  }

  overlay.style.opacity = "0";
  setTimeout(() => {
    overlay.style.display = "none";
    world.style.opacity = "1";
    refreshHotbar();
    // Tambahan Chat Sambutan
    sendMcChat("Welcome back, Naura!");
    sendMcChat("Server version 13.0.1");
  }, 800);

  const splashElement = document.getElementById("splash");
  if (splashElement) {
    splashElement.innerText =
      splashes[Math.floor(Math.random() * splashes.length)];
  }
}

// 2. Logika Update Hotbar & Item Name
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

// 3. Aksi & SFX
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
    showMcModal(
      "Survival Mode",
      "Kamu telah bertahan di server ini selama 19 tahun dengan sangat baik!"
    );
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
      // Efek Getar saat Salah
      const world = document.querySelector(".mc-world");
      world.classList.add("shake-effect");
      setTimeout(() => world.classList.remove("shake-effect"), 500);

      playMcSfx("sfx-click");
      showMcModal(
        "SECURITY ALERT",
        "Naura fell from a high place (Wrong Password!). <br><br> Hint: your special day"
      );
    }
  }
}

function actionFinal() {
  playMcSfx("sfx-level");
  confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } });

  showMcModal(
    "YOU FOUND: THE INFINITY VOUCHER",
    `<div style="background: rgba(0,0,0,0.1); border: 2px dashed #ffff55; padding: 15px; margin: 10px 0;">
            <p style="color: #ffff55; font-size: 14px; margin: 0; font-weight:bold;">🎫 DINNER DATE VOUCHER</p>
            <p style="color: #333; font-size: 10px; margin-top: 5px;">Item ini dapat digunakan kapanpun Naura ingin makan bareng. Berlaku selamanya!</p>
         </div>
         <p style="font-size: 10px;">Screenshot layar ini dan kirim ke aku untuk klaim hadiahnya! ❤️</p>`
  );
}

// Helpers
function playMcSfx(id) {
  const sfx = document.getElementById(id);
  if (sfx) {
    sfx.currentTime = 0;
    sfx.play().catch((e) => console.log("SFX Error"));
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
  const chatBox = document.createElement("div");
  chatBox.style.position = "fixed";
  chatBox.style.bottom = "160px";
  chatBox.style.left = "20px";
  chatBox.style.color = "#ffffff";
  chatBox.style.textShadow = "2px 2px #000";
  chatBox.style.fontSize = "10px";
  chatBox.style.zIndex = "1000";
  chatBox.style.transition = "opacity 1s";
  chatBox.innerHTML = `<span style="color: #aaa;">[Server]</span> ${message}`;
  document.body.appendChild(chatBox);
  setTimeout(() => {
    chatBox.style.opacity = "0";
    setTimeout(() => chatBox.remove(), 1000);
  }, 5000);
}

document.addEventListener("DOMContentLoaded", refreshHotbar);
