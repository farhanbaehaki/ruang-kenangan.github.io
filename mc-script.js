let currentStep = 0; // 0: Start, 1: Eaten Cake, 2: Read Diamond, 3: Creative Mode

function startQuest() {
    document.getElementById('start-overlay').style.display = 'none';
    document.querySelector('.mc-world').style.opacity = '1';
    document.getElementById('bgm').play();
    refreshHotbar();
}

function refreshHotbar() {
    const hotbar = document.getElementById('main-hotbar');
    hotbar.innerHTML = '';

    // Step 0: Cake
    if (currentStep === 0) {
        hotbar.innerHTML = `<div class="mc-slot" onclick="actionEat()"><img src="https://minecraft.wiki/images/Cake_JE4.png"></div>`;
    } 
    // Step 1: Diamond
    else if (currentStep === 1 || currentStep === 2) {
        hotbar.innerHTML = `<div class="mc-slot" onclick="actionDiamond()"><img src="https://minecraft.wiki/images/Diamond_JE3_BE3.png"></div>`;
    }
    // Step 3: Heart of the Sea
    if (currentStep === 3) {
        hotbar.innerHTML = `<div class="mc-slot" onclick="actionFinal()"><img src="https://minecraft.wiki/images/Heart_of_the_Sea_JE1_BE1.png"></div>`;
    }
}

function actionEat() {
    playMcSfx('sfx-click');
    currentStep = 1;
    showMcAdvancement("Sweet 19!", "Kue dimakan. Sesuatu muncul...");
    refreshHotbar();
}

function actionDiamond() {
    playMcSfx('sfx-click');
    showMcModal("Memory Crystal", "LDR mungkin berat, tapi kamu adalah berlian yang membuat semuanya layak diperjuangkan. <br><br><b>Hint:</b> Gunakan Mode Kreatif.");
    currentStep = 2;
    document.getElementById('btn-creative').classList.remove('locked');
}

function questAction(type) {
    if (type === 'creative') {
        if (currentStep < 2) {
            alert("Selesaikan misi Survival dulu!");
            return;
        }
        let code = prompt("Masukkan Passcode Rahasia (DDMM):");
        if (code === "1301") {
            playMcSfx('sfx-level');
            currentStep = 3;
            showMcAdvancement("The Architect", "Akses Jantung Samudera Terbuka!");
            refreshHotbar();
        } else {
            alert("Salah! Kode adalah tanggal lahirmu.");
        }
    }
}

function actionFinal() {
    playMcSfx('sfx-level');
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    showMcModal("HEART OF THE SEA", "Misi Selesai! Kamu menemukan hadiah terakhir. (Fase 2 akan muncul di sini)");
}

// Helpers
function playMcSfx(id) {
    const s = document.getElementById(id);
    s.currentTime = 0; s.play();
}

function showMcAdvancement(title, msg) {
    playMcSfx('sfx-level');
    const adv = document.getElementById('adv-pop');
    document.getElementById('adv-title').innerText = title;
    adv.classList.add('show');
    setTimeout(() => adv.classList.remove('show'), 4000);
}

function showMcModal(title, desc) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-desc').innerHTML = desc;
    document.getElementById('mc-modal').style.display = 'flex';
}

function closeMcModal() {
    document.getElementById('mc-modal').style.display = 'none';
}