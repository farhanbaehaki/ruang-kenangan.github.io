let currentStep = 0;
const splashes = [
  "Happy Birthday, Naura!",
  "The Best Player!",
  "LDR is just a number!",
  "Level 19 Unlocked!",
];

function startQuest() {
  const overlay = document.getElementById("start-overlay");
  const world = document.querySelector(".mc-world");
  const video = document.getElementById("mc-bg-video");
  const bgm = document.getElementById("bgm");

  // TRICK FINAL UNTUK ANDROID
  if (video) {
    video.muted = true;
    video.play(); // Pancing awal
    video.load(); // Paksa reload agar frame muncul
    video.play(); // Putar kembali
  }

  overlay.style.opacity = "0";
  setTimeout(() => {
    overlay.style.display = "none";
    world.style.opacity = "1";
  }, 600);

  if (bgm) {
    bgm.volume = 0.3;
    bgm.play().catch((e) => console.log("Audio ditahan browser"));
  }

  const splashElement = document.getElementById("splash");
  if (splashElement) {
    splashElement.innerText =
      splashes[Math.floor(Math.random() * splashes.length)];
  }

  refreshHotbar();
}

function refreshHotbar() {
  const hotbar = document.getElementById("main-hotbar");
  hotbar.innerHTML = "";
  if (currentStep === 0) {
    hotbar.innerHTML = `<div class="mc-slot" onclick="actionEat()"><img src="https://minecraft.wiki/images/Cake_JE4.png"></div>`;
  } else if (currentStep === 1 || currentStep === 2) {
    hotbar.innerHTML = `<div class="mc-slot" onclick="actionDiamond()"><img src="https://minecraft.wiki/images/Diamond_JE3_BE3.png"></div>`;
  } else if (currentStep === 3) {
    hotbar.innerHTML = `<div class="mc-slot" onclick="actionFinal()"><img src="https://minecraft.wiki/images/Heart_of_the_Sea_JE1_BE1.png"></div>`;
  }
}

function actionEat() {
  playMcSfx("sfx-click");
  currentStep = 1;
  showMcAdvancement("Sweet 19!", "Kue dimakan. Diamond muncul!");
  refreshHotbar();
}
function actionDiamond() {
  playMcSfx("sfx-click");
  showMcModal(
    "The Memory Crystal",
    "Jarak bukan masalah, kamu adalah berlian paling langka. <br><br><b>Tugas:</b> Pakai Mode Kreatif!"
  );
  currentStep = 2;
  document.getElementById("btn-creative").classList.remove("locked");
}

function questAction(type) {
  if (type === "survival") {
    showMcModal(
      "Survival Mode",
      "Kamu sudah bertahan sejauh ini dengan hebat. Teruslah berjalan!"
    );
  } else if (type === "creative") {
    if (currentStep < 2) return alert("Cari Diamond dulu!");
    let code = prompt("Masukkan Passcode (DDMM):");
    if (code === "1301") {
      playMcSfx("sfx-level");
      currentStep = 3;
      showMcAdvancement("The Architect", "Akses Heart of the Sea Terbuka!");
      refreshHotbar();
    } else if (code !== null) alert("❌ Kode salah!");
  }
}

function actionFinal() {
  playMcSfx("sfx-level");
  confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  showMcModal(
    "THE END?",
    "Kamu berhasil menyelesaikan tantangan ini! <br><br>Selamat Ulang Tahun yang ke-19, Naura!"
  );
}

function playMcSfx(id) {
  const s = document.getElementById(id);
  s.currentTime = 0;
  s.play();
}
function showMcAdvancement(title, msg) {
  playMcSfx("sfx-level");
  const adv = document.getElementById("adv-pop");
  document.getElementById("adv-title").innerText = title;
  adv.classList.add("show");
  setTimeout(() => adv.classList.remove("show"), 4500);
}
function showMcModal(title, desc) {
  document.getElementById("modal-title").innerText = title;
  document.getElementById("modal-desc").innerHTML = desc;
  document.getElementById("mc-modal").style.display = "flex";
}
function closeMcModal() {
  document.getElementById("mc-modal").style.display = "none";
}
