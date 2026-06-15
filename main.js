// --- CENTRAL DE EFEITOS SONOROS SINTÉTICOS (Web Audio API) ---
// Gera sons retro diretamente via código sem precisar de arquivos externos .mp3
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(frequency, type, duration) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
    // Efeito fade-out suave para evitar estalidos
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

// Configurações de som para ações do Arcade
const soundFX = {
    click: () => playTone(600, 'square', 0.08),
    victory: () => {
        playTone(400, 'triangle', 0.1);
        setTimeout(() => playTone(600, 'triangle', 0.1), 100);
        setTimeout(() => playTone(900, 'triangle', 0.3), 200);
    },
    achievement: () => {
        playTone(523.25, 'sine', 0.1); // C5
        setTimeout(() => playTone(659.25, 'sine', 0.1), 80);  // E5
        setTimeout(() => playTone(783.99, 'sine', 0.1), 160); // G5
        setTimeout(() => playTone(1046.50, 'sine', 0.4), 240); // C6
    }
};

// --- SIMULAÇÃO DA INTERATIVIDADE DO ARCADE ---
let totalMatches = 42;
let totalWins = 28;

function playGame(gameName) {
    soundFX.click();
    
    // Alerta estilizado simulando o carregamento da máquina de arcade
    alert(`🕹️ Conectando à cabine virtual de [ ${gameName} ]...\nPrepare seus reflexos!`);
    
    // Simulação dinâmica: Incrementa as estatísticas em tempo real na tela
    totalMatches++;
    if (Math.random() > 0.4) { // 60% de chance simulada de vitória
        totalWins++;
        setTimeout(() => soundFX.victory(), 600);
    }
    
    // Atualiza os valores na interface manipulando o DOM
    document.getElementById('stat-matches').innerText = totalMatches;
    document.getElementById('stat-wins').innerText = totalWins;
    
    // Evento Dinâmico: Desbloqueia a conquista secreta ao jogar o Quiz ou Snake
    if (gameName === 'Quiz') {
        unlockAchievement('ach-quiz');
    } else if (gameName === 'Snake') {
        unlockAchievement('ach-snake');
    }
}

function unlockAchievement(id) {
    const achCard = document.getElementById(id);
    if (achCard && achCard.classList.contains('locked')) {
        achCard.classList.remove('locked');
        achCard.classList.add('unlocked');
        
        // Substitui o ícone de cadeado pelo ícone de conquista ganha
        const icon = achCard.querySelector('.badge i');
        icon.className = id === 'ach-snake' ? 'fa-solid fa-crown' : 'fa-solid fa-award';
        
        // Emite o som glorioso de conquista
        soundFX.achievement();
    }
}

// --- CONTROLE DE NAVEGAÇÃO ILUMINADA ---
// Altera o estado do menu ativo conforme o usuário rola a página ou clica nos links
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {
    link.addEventListener('click', function() {
        soundFX.click();
        navLinks.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
    });
});