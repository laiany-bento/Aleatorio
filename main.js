// --- SISTEMA DE PERSISTÊNCIA (LOCAL STORAGE) ---
let playerData = {
    xp: parseInt(localStorage.getItem('gv_xp')) || 0,
    partidas: parseInt(localStorage.getItem('gv_partidas')) || 0,
    vitorias: parseInt(localStorage.getItem('gv_vitorias')) || 0,
    conquistas: JSON.parse(localStorage.getItem('gv_conquistas')) || []
};

// --- EMISSOR DE AUDIO RETRO (Web Audio API) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function bleep(freq, type, duration) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + duration);
}

const sons = {
    click: () => bleep(600, 'square', 0.05),
    win: () => { bleep(440, 'sine', 0.1); setTimeout(() => bleep(880, 'sine', 0.2), 100); },
    fail: () => { bleep(250, 'sawtooth', 0.2); }
};

// --- MOTOR DE ALTERNAÇÃO DE ABAS ---
const botoesNavegacao = document.querySelectorAll('.nav-btn');
const conteudosAbas = document.querySelectorAll('.tab-content');

botoesNavegacao.forEach(botao => {
    botao.addEventListener('click', (e) => {
        e.preventDefault();
        sons.click();
        const alvo = botao.getAttribute('data-target');
        mudarAba(alvo);
    });
});

function mudarAba(idAba) {
    conteudosAbas.forEach(aba => aba.classList.remove('active'));
    botoesNavegacao.forEach(btn => btn.classList.remove('active'));

    document.getElementById(idAba).classList.add('active');
    const botaoAtivo = document.querySelector(`[data-target="${idAba}"]`);
    if(botaoAtivo) botaoAtivo.classList.add('active');
}

// --- ATUALIZAÇÃO DO STATUS DO JOGADOR ---
function atualizarDados(ganhou, xpGanho = 10) {
    playerData.partidas++;
    if (ganhou) {
        playerData.vitorias++;
        playerData.xp += xpGanho;
        sons.win();
    } else {
        sons.fail();
    }
    
    // Salva no Navegador
    localStorage.setItem('gv_xp', playerData.xp);
    localStorage.setItem('gv_partidas', playerData.partidas);
    localStorage.setItem('gv_vitorias', playerData.vitorias);
    
    renderizarHUD();
    checarConquistas();
}

function renderizarHUD() {
    const nivel = Math.floor(playerData.xp / 50) + 1;
    document.getElementById('hud-level').innerHTML = `<i class="fa-solid fa-ranking-star"></i> Nível ${nivel}`;
    document.getElementById('hud-coins').innerHTML = `<i class="fa-solid fa-coins" style="color: #ffd700;"></i> ${playerData.xp} XP`;
    
    if(document.getElementById('st-partidas')) {
        document.getElementById('st-partidas').innerText = playerData.partidas;
        document.getElementById('st-vitorias').innerText = playerData.vitorias;
        document.getElementById('st-xp').innerText = playerData.xp;
    }
}

// --- CONTROLE DA MODAL DO FLIPERAMA ---
function abrirJogo(nomeJogo) {
    sons.click();
    document.getElementById('modal-game-title').innerText = nomeJogo.toUpperCase();
    document.getElementById('arcade-modal').style.display = 'flex';
    
    const arena = document.getElementById('game-arena');
    arena.innerHTML = '';

    if (nomeJogo === 'Jogo da Velha') iniciarVelha(arena);
    else if (nomeJogo === 'Pedra, Papel e Tesoura') iniciarJokenpo(arena);
    else if (nomeJogo === 'Quiz') iniciarQuiz(arena);
    else if (nomeJogo === 'Forca') iniciarForca(arena);
    else arena.innerHTML = `<p style="color:var(--texto-suave)">A cabine do ${nomeJogo} está recebendo uma atualização de software. Jogue as outras 4 cabines disponíveis!</p>`;
}

function fecharArcade() {
    sons.click();
    document.getElementById('arcade-modal').style.display = 'none';
    document.getElementById('game-arena').innerHTML = '';
}

// ==========================================
// CENTRAL DE MINIJOGOS (MÓDULOS DE LOGICA)
// ==========================================

// 1. JOGO DA VELHA
function iniciarVelha(arena) {
    let tab = ['', '', '', '', '', '', '', '', ''];
    arena.innerHTML = `<div style="max-width:270px; margin: 0 auto;">` + 
        tab.map((_, i) => `<div class="cell" id="c-${i}" onclick="jogarVelha(${i})"></div>`).join('') + 
        `</div><p id="velha-txt" class="text-green" style="margin-top:10px;">Sua vez (X)</p>`;
    window.velhaTab = tab; window.velhaAtivo = true;
}
window.jogarVelha = function(i) {
    if(!window.velhaAtivo || window.velhaTab[i] !== '') return;
    sons.click();
    window.velhaTab[i] = 'X';
    document.getElementById(`c-${i}`).innerText = 'X';
    if(venceuVelha(window.velhaTab, 'X')) {
        document.getElementById('velha-txt').innerText = "Você ganhou! +20XP";
        window.velhaAtivo = false; atualizarDados(true, 20); return;
    }
    if(!window.velhaTab.includes('')) { document.getElementById('velha-txt').innerText = "Empate!"; atualizarDados(false); return; }
    
    window.velhaAtivo = false;
    setTimeout(() => {
        let livres = window.velhaTab.map((v, idx) => v === '' ? idx : null).filter(v => v !== null);
        let bot = livres[Math.floor(Math.random() * livres.length)];
        window.velhaTab[bot] = 'O';
        document.getElementById(`c-${bot}`).innerText = 'O';
        if(venceuVelha(window.velhaTab, 'O')) {
            document.getElementById('velha-txt').innerText = "CPU Venceu!";
            atualizarDados(false);
        } else {
            document.getElementById('velha-txt').innerText = "Sua vez (X)";
            window.velhaAtivo = true;
        }
    }, 400);
}
function venceuVelha(t, p) {
    const regras = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return regras.some(r => r.every(idx => t[idx] === p));
}

// 2. PEDRA, PAPEL E TESOURA
function iniciarJokenpo(arena) {
    arena.innerHTML = `
        <div class="jokenpo-controls">
            <button class="btn-choice" onclick="jogarJKP('✊')">✊</button>
            <button class="btn-choice" onclick="jogarJKP('✋')">✋</button>
            <button class="btn-choice" onclick="jogarJKP('✌️')">✌️</button>
        </div>
        <p id="jkp-res" style="margin-top:25px; font-family:'Orbitron'; font-size:1.1rem;"></p>
    `;
}
window.jogarJKP = function(opcaoPlayer) {
    sons.click();
    const lista = ['✊', '✋', '✌️'];
    const opcaoCPU = lista[Math.floor(Math.random() * 3)];
    const res = document.getElementById('jkp-res');
    if(opcaoPlayer === opcaoCPU) { res.innerHTML = `Empate! Ambos escolheram ${opcaoPlayer}`; atualizarDados(false); }
    else if ((opcaoPlayer==='✊'&&opcaoCPU==='✌️') || (opcaoPlayer==='✋'&&opcaoCPU==='✊') || (opcaoPlayer==='✌️'&&opcaoCPU==='✋')) {
        res.innerHTML = `Você: ${opcaoPlayer} vs CPU: ${opcaoCPU}<br><span class="text-green">Vitória! +10XP</span>`;
        atualizarDados(true, 10);
    } else { res.innerHTML = `Você: ${opcaoPlayer} vs CPU: ${opcaoCPU}<br><span style="color:#ff0055">Derrota!</span>`; atualizarDados(false); }
}

// 3. QUIZ GEEK
function iniciarQuiz(arena) {
    window.quizData = [
        { q: "Qual componente é o 'cérebro' do PC?", o: ["Memória RAM", "Processador (CPU)", "Placa de Vídeo"], r: 1 },
        { q: "O que significa HTML?", o: ["HyperText Markup Language", "High Technology Motor Link", "Hyper Transfer Multi Language"], r: 0 }
    ];
    window.quizEtapa = 0;
    renderEtapaQuiz(arena);
}
function renderEtapaQuiz(arena) {
    if(window.quizEtapa >= window.quizData.length) {
        arena.innerHTML = `<p class="text-green" style="font-family:'Orbitron';">Parabéns! Você concluiu o Quiz! +30XP</p>`;
        atualizarDados(true, 30);
        playerData.conquistas.push('cq-quiz');
        localStorage.setItem('gv_conquistas', JSON.stringify(playerData.conquistas));
        return;
    }
    let item = window.quizData[window.quizEtapa];
    arena.innerHTML = `<p style="margin-bottom:15px; font-weight:500;">${item.q}</p>` +
        item.o.map((opt, id) => `<button class="quiz-option" onclick="responderQuiz(${id})">${opt}</button>`).join('');
}
window.responderQuiz = function(idEscolhido) {
    if(idEscolhido === window.quizData[window.quizEtapa].r) {
        window.quizEtapa++;
        renderEtapaQuiz(document.getElementById('game-arena'));
    } else {
        document.getElementById('game-arena').innerHTML = `<p style="color:#ff0055">Resposta Errada! Fim de Jogo.</p>`;
        atualizarDados(false);
    }
}

// 4. JOGO DA FORCA
function iniciarForca(arena) {
    const palavras = ["DEVELOPER", "TECLADO", "ARCADE", "MONITOR", "PIXEL"];
    window.forcaPalavra = palavras[Math.floor(Math.random() * palavras.length)];
    window.forcaDescobertas = Array(window.forcaPalavra.length).fill("_");
    window.forcaErros = 0;
    renderForca();
}
function renderForca() {
    const arena = document.getElementById('game-arena');
    if(!window.forcaDescobertas.includes("_")) {
        arena.innerHTML = `<p class="text-green" style="font-family:'Orbitron'; font-size:1.3rem;">Palavra Descoberta: ${window.forcaPalavra}!<br>+25 XP</p>`;
        atualizarDados(true, 25); return;
    }
    if(window.forcaErros >= 5) {
        arena.innerHTML = `<p style="color:#ff0055; font-family:'Orbitron'; font-size:1.2rem;">GAME OVER!<br>A palavra era ${window.forcaPalavra}</p>`;
        atualizarDados(false); return;
    }
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    arena.innerHTML = `
        <p style="color:var(--texto-suave)">Erros: ${window.forcaErros} de 5</p>
        <div class="forca-word">${window.forcaDescobertas.join(" ")}</div>
        <div class="forca-teclado">
            ${letras.map(l => `<button class="btn-letra" id="l-${l}" onclick="tentarLetra('${l}')">${l}</button>`).join('')}
        </div>
    `;
}
window.tentarLetra = function(l) {
    sons.click();
    document.getElementById(`l-${l}`).disabled = true;
    if(window.forcaPalavra.includes(l)) {
        for(let i=0; i<window.forcaPalavra.length; i++) {
            if(window.forcaPalavra[i] === l) window.forcaDescobertas[i] = l;
        }
    } else { window.forcaErros++; }
    renderForca();
}

// --- RECURSO: LOJA DE CORES ---
window.mudarTema = function(cor) {
    sons.click();
    document.documentElement.style.setProperty('--azul-neon', cor);
    header.style.borderBottomColor = cor;
}

// --- CONQUISTAS MECÂNICA ---
function checarConquistas() {
    if(playerData.vitorias >= 1 && !playerData.conquistas.includes('cq-1')) playerData.conquistas.push('cq-1');
    if(playerData.partidas >= 10 && !playerData.conquistas.includes('cq-10')) playerData.conquistas.push('cq-10');
    
    localStorage.setItem('gv_conquistas', JSON.stringify(playerData.conquistas));
    renderizarConquistas();
}

function renderizarConquistas() {
    playerData.conquistas.forEach(id => {
        const elemento = document.getElementById(id);
        if(elemento && elemento.classList.contains('locked')) {
            elemento.classList.remove('locked');
            elemento.classList.add('unlocked');
            const icon = elemento.querySelector('.badge i');
            icon.className = "fa-solid fa-award";
        }
    });
}

// INICIALIZAÇÃO AUTOMÁTICA AO CARREGAR O SITE
window.onload = () => {
    renderizarHUD();
    checarConquistas();
};