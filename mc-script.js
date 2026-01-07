// 1. INISIALISASI VARIABEL ASLI
const bgm = document.getElementById("bgm");
const sfxClick = document.getElementById("sfx-click");
const sfxChallenge = document.getElementById("sfx-challenge");
const startOverlay = document.getElementById("start-overlay");
const lootModal = document.getElementById("loot-modal");
const mainScreen = document.querySelector(".minecraft-screen");

// Variable untuk Quest Berantai
let questStep = 0; 

// 2. FUNGSI HELPER
function playSfx(audio) {
  audio.currentTime = 0;
  audio.play().catch(() => {});
  if (navigator.vibrate) navigator.vibrate(40);
}

// 3. LOGIKA START GAME (Fitur Asli)
startOverlay.addEventListener("click", () => {
  startOverlay.style.opacity = "0";
  setTimeout(() => {
    startOverlay.style.display = "none";
    mainScreen.classList.add("show-content");
  }, 500);
  bgm.volume = 0.3;
  bgm.play().catch((e) => console.log("Blocked"));
  playSfx(sfxClick);
});

// 4. SISTEM LOOT (Gabungan: Fitur Asli + Quest Berantai)
function openLoot(title, text, element) {
  playSfx(sfxClick);
  const lootTitle = document.getElementById("loot-title");
  const lootText = document.getElementById("loot-text");
  
  lootTitle.innerText = title;

  if (title === 'Heart') {
    lootText.innerHTML = `
      ${text} <br><br>
      <div style="background: rgba(82, 173, 45, 0.2); border: 2px dashed #52ad2d; padding: 10px; margin-top: 10px; font-size: 0.8rem; color: #1a1a1a;">
        <span style="color: #0000AA; font-weight: bold;">[!] FINAL QUEST COMPLETE</span><br>
        Harta karun terdeteksi di koordinat nyata!<br>
        <b>Cek di: Bawah Bantal / Meja Kamu!</b> 🎁
      </div>
    `;
    // Efek Confetti saat Heart dibuka (Fitur Baru)
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  } else {
    lootText.innerText = text;
  }

  lootModal.style.display = "flex";

  // Logic Quest: Setelah Diamond dibuka, aktifkan tombol Passcode
  if (title === 'Diamond') {
    document.getElementById("btn-creative").style.opacity = "1";
    questStep = 2; // Naik ke step 2
  }
}

function closeLoot() {
  playSfx(sfxClick);
  lootModal.style.display = "none";
}

// 5. SISTEM MAKAN (Quest Step 1)
function eatCake(element) {
  playSfx(sfxClick);
  element.style.display = "none";
  showAdvancement("Sweet Tooth!", "Misi 1: Berhasil! Sekarang Diamond muncul.");
  
  // Munculkan Diamond
  setTimeout(() => {
    const dSlot = document.getElementById("slot-diamond");
    dSlot.style.display = "flex";
    dSlot.classList.add("active-slot");
    questStep = 1;
  }, 1000);
}

// 6. ADVANCEMENT SYSTEM (Fitur Asli)
function showAdvancement(title, desc) {
  playSfx(sfxChallenge);
  const adv = document.getElementById("advancement");
  document.getElementById("adv-title").innerText = title;
  document.getElementById("adv-desc").innerText = desc;
  adv.classList.add("show");
  setTimeout(() => adv.classList.remove("show"), 5000);
}

// 7. PASSCODE SYSTEM (Quest Step 3)
function checkPasscode() {
  if (questStep < 2) {
    alert("❌ Selesaikan misi Diamond dulu!");
    return;
  }
  const passcode = prompt("Masukkan Passcode (DDMM):");
  if (passcode === "1301") { 
    showAdvancement("The Architect", "Akses Hati Terbuka! Klik item baru di bawah.");
    // Munculkan Heart
    document.getElementById("slot-heart").style.display = "flex";
    document.getElementById("slot-heart").classList.add("active-slot");
    questStep = 3;
  } else if (passcode !== null) {
    alert("❌ Passcode Salah! (Hint: Tanggal lahirmu)");
  }
}

// 8. SPLASH TEXT DINAMIS (Fitur Asli)
const splashQuotes = ["Level 19!", "HBD Naura!", "Legendary Player", "Diamond Girl", "Sayang Naura!"];
setInterval(() => {
  const splash = document.getElementById("splash");
  if (splash) {
    splash.style.opacity = 0;
    setTimeout(() => {
      splash.innerText = splashQuotes[Math.floor(Math.random() * splashQuotes.length)];
      splash.style.opacity = 1;
    }, 500);
  }
}, 5000);

// 9. FINAL CINEMATIC (Fitur Asli)
function finalCinematic() {
    // Dipanggil melalui interaksi opsional atau jika kamu ingin otomatis
    playSfx(sfxChallenge);
    confetti({ particleCount: 200, spread: 90 });
    mainScreen.innerHTML = `
        <div class="ending-credits" style="text-align: center; color: white; padding: 20px; padding-top: 25vh;">
            <h2 style="color: #ffff55;">ACHIEVEMENT REACHED!</h2>
            <p style="font-size: 0.9rem; margin: 20px 0; line-height: 1.6;">
                "I see the player you mean... Naura.<br>Cintaku ke kamu gak akan pernah retak."
            </p>
            <div style="background: #373737; border: 4px solid #52ad2d; padding: 15px; display: inline-block;">
                <p style="font-size: 0.8rem; margin: 0;">REAL WORLD QUEST:</p>
                <p style="color: #ffff55; margin: 5px 0 0 0;">Ambil kado fisikmu sekarang! 🎁</p>
            </div>
        </div>
    `;
}