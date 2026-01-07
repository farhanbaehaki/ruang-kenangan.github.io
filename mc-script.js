const bgm = document.getElementById("bgm");
const sfxClick = document.getElementById("sfx-click");
const sfxChallenge = document.getElementById("sfx-challenge");
const startOverlay = document.getElementById("start-overlay");
const lootModal = document.getElementById("loot-modal");
const mainScreen = document.querySelector(".minecraft-screen");

function playSfx(audio) {
  audio.currentTime = 0;
  audio.play().catch(() => {});
  if (navigator.vibrate) navigator.vibrate(50);
}

startOverlay.addEventListener("click", () => {
  startOverlay.style.opacity = "0";
  setTimeout(() => {
    startOverlay.style.display = "none";
    mainScreen.classList.add("show-content");
  }, 500);
  bgm.volume = 0.4;
  bgm.play().catch(() => {});
  playSfx(sfxClick);
});

function openLoot(title, text, element) {
  playSfx(sfxClick);
  const lTitle = document.getElementById("loot-title");
  const lText = document.getElementById("loot-text");
  lTitle.innerText = title;

  if (title === "Heart") {
    lText.innerHTML = `${text} <br><br> 
        <div style="background: rgba(82, 173, 45, 0.3); border: 2px dashed #2e6119; padding: 10px; color: #1a1a1a; font-size: 10px; margin-top: 10px;">
          <b style="color: #2e6119;">[!] QUEST UPDATED</b><br>
          Harta karun terdeteksi di koordinat nyata!<br>
          <span style="color: #0000AA;">Coba cek di: Bawah Bantal / Meja Kamu! 🎁</span>
        </div>`;
  } else {
    lText.innerText = text;
  }
  lootModal.style.display = "flex";
  if (element) element.classList.remove("active-slot");
}

function closeLoot() {
  playSfx(sfxClick);
  lootModal.style.display = "none";
}

function eatCake(element) {
  playSfx(sfxClick);
  element.style.display = "none";
  showAdvancement("Sweet Tooth!", "Makan kue di hari spesial.");
}

function showAdvancement(title, desc) {
  playSfx(sfxChallenge);
  const adv = document.getElementById("advancement");
  document.getElementById("adv-title").innerText = title;
  document.getElementById("adv-desc").innerText = desc;
  adv.classList.add("show");
  setTimeout(() => adv.classList.remove("show"), 5000);
}

function checkPasscode() {
  const code = prompt("Masukkan Passcode (DDMM):");
  if (code === "1301") {
    showAdvancement("The Architect", "Membangun masa depan bersama.");
    setTimeout(finalCinematic, 2000);
  } else if (code !== null) {
    alert("❌ Passcode Salah! Hint: Tanggal & Bulan lahir Naura.");
  }
}
// Tambahkan di fungsi finalCinematic agar lebih meriah
function finalCinematic() {
    playSfx(sfxChallenge);
    
    // Efek Confetti
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });

    mainScreen.innerHTML = `
      <div style="text-align: center; color: white; padding: 20px; padding-top: 25vh; font-family: 'Minecraftia';">
        <h2 style="color: #ffff55; text-shadow: 2px 2px #000; font-size: 20px;">QUEST COMPLETE!</h2>
        <p style="margin: 20px; font-size: 10px; line-height: 1.8;">
          "I see the player you mean... Naura.<br>
          The one who just unlocked the best gift."
        </p>
        <div style="background: #313131; border: 4px solid #52ad2d; padding: 15px; display: inline-block;">
          <p style="font-size: 8px; margin: 0; color: #aaaaaa;">CHEST COORDINATES:</p>
          <p style="color: #ffff55; margin: 5px 0 0 0; font-size: 12px;">Cek di Bawah Kasur! 🎁</p>
        </div>
        <br>
        <button onclick="location.reload()" class="mc-button" style="margin-top: 30px; width: 180px;">RESPAWN</button>
      </div>
    `;
}

// Splash Text randomizer
const quotes = [
  "Level 19!",
  "HBD Naura!",
  "Diamond Girl",
  "Sayang Naura!",
  "Legendary Player",
];
setInterval(() => {
  const splash = document.getElementById("splash");
  if (splash)
    splash.innerText = quotes[Math.floor(Math.random() * quotes.length)];
}, 4000);
