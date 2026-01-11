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

  // SETINGAN SUARA
  if (video) {
    video.muted = true; // MATIKAN suara video agar tidak tabrakan
    video.play().catch((e) => console.log("Video play dipending"));
  }

  if (bgm) {
    bgm.volume = 0.3; // Atur volume musik Haggstrom agar pas (0.1 - 1.0)
    bgm
      .play()
      .catch((e) =>
        console.log("Audio diblokir browser, butuh interaksi user")
      );
  }

  // Transisi
  overlay.style.opacity = "0";
  setTimeout(() => {
    overlay.style.display = "none";
    world.style.opacity = "1";
    refreshHotbar();
  }, 800);

  const splashElement = document.getElementById("splash");
  if (splashElement) {
    splashElement.innerText =
      splashes[Math.floor(Math.random() * splashes.length)];
  }
}

// 2. Logika Update Hotbar (Foto & Jalur File)
function refreshHotbar() {
  const hotbar = document.getElementById("main-hotbar");
  if (!hotbar) return;

  hotbar.innerHTML = "";

  // Pastikan path folder benar: assets/photos/
  const path = "assets/photos/";

  if (currentStep === 0) {
    hotbar.innerHTML = `<div class="mc-slot" onclick="actionEat()"><img src="${path}cake.gif"></div>`;
  } else if (currentStep === 1 || currentStep === 2) {
    hotbar.innerHTML = `<div class="mc-slot" onclick="actionDiamond()"><img src="${path}gift1.jpg"></div>`;
  } else if (currentStep === 3) {
    // PERBAIKAN: Foto Diamond Terakhir
    hotbar.innerHTML = `<div class="mc-slot" onclick="actionFinal()"><img src="${path}diamond1.jpg"></div>`;
  }
}

// 3. Aksi & SFX
function actionEat() {
  playMcSfx("sfx-click"); // Memutar suara klik
  currentStep = 1;
  showMcAdvancement("Sweet 19!", "Kue dimakan. Hadiah muncul!");
  refreshHotbar();
}

function actionDiamond() {
  playMcSfx("sfx-click");
  showMcModal(
    "Crystal of Memory",
    "Jarak bukan halangan bagi pemain hebat. <br><br><b>Misi:</b> Klik tombol CREATIVE MODE dan masukkan kode rahasia."
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

    let code = prompt("Masukkan Passcode (Tanggal Lahir Naura DDMM):");
    if (code === "1301") {
      playMcSfx("sfx-level"); // Memutar suara challenge complete
      currentStep = 3;
      showMcAdvancement("The Architect", "Akses Berlian telah terbuka!");
      refreshHotbar();
    } else if (code !== null) {
      alert("❌ Kode salah! Petunjuk: Tanggal lahirmu (Contoh: 0101)");
    }
  }
}

function actionFinal() {
  playMcSfx("sfx-level");
  confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  showMcModal(
    "HAPPY BIRTHDAY!",
    "Selamat Naura! Quest selesai. Kamu mendapatkan Diamond! 🎉"
  );
}

// Fungsi bantu untuk memutar suara
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

document.addEventListener("DOMContentLoaded", refreshHotbar);
