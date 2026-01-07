let currentStep = 0;

const splashes = [
    "Happy Birthday, Naura!",
    "The Best Player!",
    "LDR is just a number!",
    "Diamond for Diamond!",
    "Made with Love!",
    "Level 19 Unlocked!"
];

function startQuest() {
    const overlay = document.getElementById("start-overlay");
    const world = document.querySelector(".mc-world");
    const video = document.getElementById("mc-bg-video");
    const bgm = document.getElementById("bgm");

    // 1. HIDUPKAN VIDEO DI BALIK LAYAR HITAM
    if (video) {
        video.muted = true; 
        video.currentTime = 0;
        // Gunakan Promise untuk memastikan video benar-benar jalan
        video.play().then(() => {
            console.log("Video is playing, starting transition...");
            
            // 2. MULAI TRANSISI (Hanya jika video sudah 'play')
            setTimeout(() => {
                overlay.style.opacity = "0";
                
                setTimeout(() => {
                    overlay.style.display = "none";
                    world.style.opacity = "1";
                    // Paksa background world transparan
                    world.style.background = "transparent";
                }, 600);
            }, 150);
        }).catch(e => {
            console.log("Video fail, opening overlay anyway:", e);
            overlay.style.opacity = "0";
            setTimeout(() => overlay.style.display = "none", 600);
        });
    }

    // --- Splash & Audio ---
    const splashElement = document.getElementById("splash");
    if (splashElement) {
        const randomSplash = splashes[Math.floor(Math.random() * splashes.length)];
        splashElement.innerText = randomSplash;
    }

    if (bgm) {
        bgm.volume = 0.3;
        bgm.play().catch(e => console.log("Audio blocked by browser"));
    }
    
    refreshHotbar();
}

// ... Fungsi refreshHotbar, actionEat, dll tetap sama ...

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
  showMcAdvancement("Sweet 19!", "Kue dimakan. Diamond muncul di Hotbar!");
  refreshHotbar();
}

function actionDiamond() {
  playMcSfx("sfx-click");
  showMcModal(
    "The Memory Crystal",
    "Jarak 1000 block bukan masalah, karena kamu adalah berlian paling langka di server ini. <br><br><b>Tugas:</b> Aktifkan Mode Kreatif untuk menembus batas."
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
      alert("❌ Kode salah! Coba tanggal lahirmu.");
    }
  }
}

function actionFinal() {
  playMcSfx("sfx-level");
  confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  showMcModal(
    "THE END?",
    "Kamu berhasil menyelesaikan Fase 1! <br><br>Siap untuk kejutan berikutnya?"
  );
}

// Helpers
function playMcSfx(id) {
  const s = document.getElementById(id);
  s.currentTime = 0;
  s.play();
  if (navigator.vibrate) navigator.vibrate(50);
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
