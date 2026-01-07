let currentStep = 0;

const splashes = [
  "Happy Birthday, Naura!",
  "The Best Player!",
  "LDR is just a number!",
  "Diamond for Diamond!",
  "Made with Love!",
  "Level 19 Unlocked!",
];

/**
 * Memicu dimulainya pengalaman setelah user klik overlay awal
 */
function startQuest() {
  const overlay = document.getElementById("start-overlay");
  const world = document.querySelector(".mc-world");
  const video = document.getElementById("mc-bg-video");
  const bgm = document.getElementById("bgm");

  // 1. Logika Video: Coba putar video terlebih dahulu
  if (video) {
    video.muted = true; // Syarat wajib autoplay mobile
    video
      .play()
      .then(() => {
        // Jika video berhasil play, baru pudarkan layar hitam
        executeTransition(overlay, world);
      })
      .catch((e) => {
        console.warn("Video failed to play, skipping transition wait.", e);
        executeTransition(overlay, world);
      });
  } else {
    executeTransition(overlay, world);
  }

  // 2. Logika Audio & Splash
  if (bgm) {
    bgm.volume = 0.3;
    bgm.play().catch(() => console.log("Audio blocked by browser policy"));
  }

  const splashElement = document.getElementById("splash");
  if (splashElement) {
    const randomSplash = splashes[Math.floor(Math.random() * splashes.length)];
    splashElement.innerText = randomSplash;
  }

  refreshHotbar();
}

/**
 * Menangani efek transisi memudar (fading)
 */
function executeTransition(overlay, world) {
  overlay.style.opacity = "0";
  setTimeout(() => {
    overlay.style.display = "none";
    world.style.opacity = "1";
  }, 800);
}

/**
 * Memperbarui tampilan slot hotbar di bagian bawah layar
 */
function refreshHotbar() {
  const hotbar = document.getElementById("main-hotbar");
  if (!hotbar) return;

  let content = "";
  if (currentStep === 0) {
    content = `<div class="mc-slot" onclick="actionEat()"><img src="https://minecraft.wiki/images/Cake_JE4.png" alt="Cake"></div>`;
  } else if (currentStep === 1 || currentStep === 2) {
    content = `<div class="mc-slot" onclick="actionDiamond()"><img src="https://minecraft.wiki/images/Diamond_JE3_BE3.png" alt="Diamond"></div>`;
  } else if (currentStep === 3) {
    content = `<div class="mc-slot" onclick="actionFinal()"><img src="https://minecraft.wiki/images/Heart_of_the_Sea_JE1_BE1.png" alt="Heart"></div>`;
  }

  hotbar.innerHTML = content;
}

/**
 * AKSI: Makan Kue
 */
function actionEat() {
  playMcSfx("sfx-click");
  currentStep = 1;
  showMcAdvancement("Sweet 19!", "Kue dimakan. Diamond muncul di Hotbar!");
  refreshHotbar();
}

/**
 * AKSI: Klik Diamond
 */
function actionDiamond() {
  playMcSfx("sfx-click");
  showMcModal(
    "The Memory Crystal",
    "Jarak 1000 block bukan masalah, karena kamu adalah berlian paling langka di server ini. <br><br><b>Tugas:</b> Aktifkan Mode Kreatif untuk menembus batas."
  );
  currentStep = 2;
  const btnCreative = document.getElementById("btn-creative");
  if (btnCreative) btnCreative.classList.remove("locked");
}

/**
 * AKSI: Menu Tombol (Survival/Creative)
 */
function questAction(type) {
  if (type === "survival") {
    showMcModal(
      "Survival Mode",
      "Kamu sudah bertahan sejauh ini dengan hebat. Teruslah berjalan!"
    );
  } else if (type === "creative") {
    if (currentStep < 2) {
      alert("Selesaikan misi Diamond dulu!");
      return;
    }

    let code = prompt("Masukkan Passcode (DDMM):");
    if (code === "1301") {
      playMcSfx("sfx-level");
      currentStep = 3;
      showMcAdvancement("The Architect", "Akses Jantung Samudera Terbuka!");
      refreshHotbar();
    } else if (code !== null) {
      alert("❌ Kode salah! Coba tanggal lahirmu (Contoh: 1301).");
    }
  }
}

/**
 * AKSI FINAL: Klik Heart of the Sea
 */
function actionFinal() {
  playMcSfx("sfx-level");

  // Efek Selebrasi
  if (typeof confetti === "function") {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00"],
    });
  }

  showMcModal(
    "THE END?",
    "Kamu berhasil menyelesaikan tantangan hari ini! <br><br>Selamat ulang tahun yang ke-19, Naura. Tetaplah menjadi player kebanggaanku! ❤️"
  );
}

// --- HELPER FUNCTIONS ---

function playMcSfx(id) {
  const sfx = document.getElementById(id);
  if (sfx) {
    sfx.currentTime = 0;
    sfx.play().catch(() => {});
  }
  if (navigator.vibrate) navigator.vibrate(50);
}

function showMcAdvancement(title, msg) {
  playMcSfx("sfx-level");
  const adv = document.getElementById("adv-pop");
  const advTitle = document.getElementById("adv-title");

  if (adv && advTitle) {
    advTitle.innerText = title;
    adv.classList.add("show");
    setTimeout(() => adv.classList.remove("show"), 4500);
  }
}

function showMcModal(title, desc) {
  const modal = document.getElementById("mc-modal");
  const mTitle = document.getElementById("modal-title");
  const mDesc = document.getElementById("modal-desc");

  if (modal && mTitle && mDesc) {
    mTitle.innerText = title;
    mDesc.innerHTML = desc;
    modal.style.display = "flex";
  }
}

function closeMcModal() {
  const modal = document.getElementById("mc-modal");
  if (modal) modal.style.display = "none";
  playMcSfx("sfx-click");
}
