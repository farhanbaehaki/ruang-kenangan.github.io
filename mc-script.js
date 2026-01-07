let selectedCount = 0;
const totalItems = 4;

function selectItem(el, name) {
    if (!el.classList.contains('selected')) {
        el.classList.add('selected');
        selectedCount++;
        
        // Efek suara klik (opsional jika ada file mp3)
        // new Audio('click.mp3').play();

        if (selectedCount === totalItems) {
            const instruction = document.getElementById('instruction');
            instruction.innerText = "Inventory Full! Klik Petinya! 🔓";
            instruction.style.color = "#ffff55"; // Warna kuning khas Minecraft
        }
    }
}

function openChest() {
    if (selectedCount < totalItems) {
        alert("Inventory belum penuh! Ambil semua item dulu.");
        return;
    }

    const chest = document.getElementById('chest-icon');
    chest.innerText = "🔓";
    
    setTimeout(() => {
        document.getElementById('gift-popup').style.display = 'block';
    }, 400);
}