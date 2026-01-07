let questStep = 0;

function playSfx(audio) {
  const sound = document.getElementById(audio);
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

// Start Game
document.getElementById("start-overlay").addEventListener("click", function () {
  this.style.display = "none";
  document.querySelector(".minecraft-screen").style.opacity = "1";
  document.getElementById("bgm").play();
});

// Langkah 1: Makan Kue
function eatCake(el) {
  playSfx("sfx-click");
  el.style.display = "none";
  showAdvancement("Sweet Tooth", "Misi 1: Selesai! Sekarang cek tasmu.");

  // Munculkan Diamond (Quest 2)
  setTimeout(() => {
    document.getElementById("slot-diamond").style.display = "flex";
    document.getElementById("slot-diamond").classList.add("active-slot");
    questStep = 1;
  }, 1000);
}

// Langkah 2: Diamond
function openLoot(title, text, el) {
  playSfx("sfx-click");
  document.getElementById("loot-title").innerText = title;

  if (title === "Heart") {
    document.getElementById("loot-text").innerHTML =
      text +
      "<br><br><b style='color:#52ad2d'>QUEST COMPLETE!</b><br>Kado fisik ada di: [LOKASI HADIAH]";
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  } else {
    document.getElementById("loot-text").innerText = text;
  }

  document.getElementById("loot-modal").style.display = "flex";

  if (title === "Diamond") {
    // Aktifkan tombol Passcode setelah baca pesan diamond
    document.getElementById("btn-creative").style.opacity = "1";
    questStep = 2;
  }
}

function closeLoot() {
  document.getElementById("loot-modal").style.display = "none";
}

// Langkah 3: Cek Passcode
function checkPasscode() {
  if (questStep < 2) {
    alert("Selesaikan misi Diamond dulu!");
    return;
  }
  const code = prompt("Masukkan Tanggal Lahirmu (DDMM):");
  if (code === "1301") {
    showAdvancement("The Architect", "Akses Hati Terbuka!");
    document.getElementById("slot-heart").style.display = "flex";
    document.getElementById("slot-heart").classList.add("active-slot");
    questStep = 3;
  } else {
    alert("Salah! Coba ingat tanggal lahirmu.");
  }
}

function showAdvancement(title, desc) {
  playSfx("sfx-challenge");
  const adv = document.getElementById("advancement");
  document.getElementById("adv-title").innerText = title;
  document.getElementById("adv-desc").innerText = desc;
  adv.classList.add("show");
  setTimeout(() => adv.classList.remove("show"), 5000);
}
