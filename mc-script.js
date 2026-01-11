let currentStep = 0;

const splashes = [
    "Happy Birthday, Naura!",
    "The Best Player!",
    "LDR is just a number!",
    "Level 19 Unlocked!",
    "Made with Love!"
];

// 1. Fungsi Utama saat Klik "TAP TO JOIN WORLD"
function startQuest() {
    const overlay = document.getElementById("start-overlay");
    const world = document.querySelector(".mc-world");
    const video = document.getElementById("mc-bg-video");
    const bgm = document.getElementById("bgm");

    // Mainkan Video & Musik
    if (video) {
        video.muted = false; // Agar suara video terdengar
        video.play().catch(e => console.log("Video play dipending"));
    }
    
    if (bgm) {
        bgm.volume = 0.3;
        bgm.play().catch(e => console.log("Audio diblokir browser"));
    }

    // Transisi halus: Hilangkan layar hitam, munculkan dunia Minecraft
    overlay.style.opacity = "0";
    setTimeout(() => {
        overlay.style.display = "none";
        world.style.opacity = "1";
        // PENTING: Refresh hotbar agar kue muncul segera setelah dunia terbuka
        refreshHotbar(); 
    }, 800);

    // Set Splash Text secara acak
    const splashElement = document.getElementById("splash");
    if (splashElement) {
        splashElement.innerText = splashes[Math.floor(Math.random() * splashes.length)];
    }
}

// 2. Logika Update Hotbar
function refreshHotbar() {
    const hotbar = document.getElementById("main-hotbar");
    if (!hotbar) return;

    hotbar.innerHTML = "";

    if (currentStep === 0) {
        // Step 0: Kue (Hilangkan garis miring di depan assets)
        hotbar.innerHTML = `<div class="mc-slot" onclick="actionEat()"><img src="assets/photos/cake.gif"></div>`;
    } else if (currentStep === 1 || currentStep === 2) {
        // Step 1: Hadiah (Pastikan namanya gift.jpg)
        hotbar.innerHTML = `<div class="mc-slot" onclick="actionDiamond()"><img src="assets/photos/gift.jpg"></div>`;
    } else if (currentStep === 3) {
        // Step 3: Diamond (Hilangkan / di depan assets)
        hotbar.innerHTML = `<div class="mc-slot" onclick="actionFinal()"><img src="assets/photos/diamond1.jpg"></div>`;
    }
}

// 3. Aksi saat Item di Hotbar diklik
function actionEat() {
    playMcSfx("sfx-click");
    currentStep = 1;
    showMcAdvancement("Sweet 19!", "Kue dimakan. Diamond didapatkan!");
    refreshHotbar();
}

function actionDiamond() {
    playMcSfx("sfx-click");
    showMcModal(
        "Crystal of Memory",
        "Jarak bukan halangan bagi pemain hebat. <br><br><b>Misi:</b> Klik tombol CREATIVE MODE dan masukkan kode rahasia."
    );
    currentStep = 2;
    // Buka kunci tombol Creative
    const btn = document.getElementById("btn-creative");
    if (btn) {
        btn.classList.remove("locked");
        btn.innerHTML = "CREATIVE MODE 🔓";
    }
}

// 4. Aksi Tombol Menu (Survival & Creative)
function questAction(type) {
    playMcSfx("sfx-click");
    
    if (type === "survival") {
        showMcModal("Survival Mode", "Kamu telah bertahan di server ini selama 19 tahun dengan sangat baik!");
    } else if (type === "creative") {
        if (currentStep < 2) {
            showMcModal("LOCKED", "Selesaikan misi Diamond di Hotbar terlebih dahulu!");
            return;
        }
        
        let code = prompt("Masukkan Passcode (Tanggal Lahir Naura DDMM):");
        if (code === "1301") {
            playMcSfx("sfx-level");
            currentStep = 3;
            showMcAdvancement("The Architect", "Akses Jantung Samudera telah terbuka!");
            refreshHotbar();
        } else if (code !== null) {
            alert("❌ Kode salah! Petunjuk: Tanggal lahirmu (Contoh: 0101)");
        }
    }
}

function actionFinal() {
    playMcSfx("sfx-level");
    // Efek kembang api kado
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });
    showMcModal("HAPPY BIRTHDAY!", "Selamat Naura! Quest selesai. Semoga harimu menyenangkan! 🎉");
}

// 5. Fungsi Pembantu (Helpers)
function playMcSfx(id) {
    const sfx = document.getElementById(id);
    if (sfx) {
        sfx.currentTime = 0;
        sfx.play();
    }
}

function showMcModal(title, desc) {
    const modal = document.getElementById("mc-modal");
    if (modal) {
        document.getElementById("modal-title").innerText = title;
        document.getElementById("modal-desc").innerHTML = desc;
        modal.style.display = "flex";
    }
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

// Inisialisasi awal agar hotbar tidak kosong saat pertama kali world muncul
document.addEventListener("DOMContentLoaded", refreshHotbar);