// --- CENTRAL DE PERSISTÊNCIA (LOCAL STORAGE) ---
let playerData = {
    xp: parseInt(localStorage.getItem('gv_xp')) || 0,
    partidas: parseInt(localStorage.getItem('gv_partidas')) || 0,
    vitorias: parseInt(localStorage.getItem('gv_vitorias')) || 0,
    conquistas: JSON.parse(localStorage.getItem('gv_conquistas')) || [],
    highSnake: parseInt(localStorage.getItem('gv_high_snake')) || 0
};

// --- ÁUDIO SYNTH RETRO ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function bleep(freq, type, duration) {
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type; osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + duration);
    } catch(e) {}
}
const sons = {
    click: () => bleep(600, 'square', 0.05),
    win: () => { bleep(440, 'sine', 0.08); setTimeout(() => bleep(880, 'sine', 0.15), 80); },
    fail: () => { bleep(200, 'sawtooth', 0.25); }
};

// --- CONTROLE DE ABAS ---
const botoesNavegacao = document.querySelectorAll('.nav-btn');
const conteudosAbas = document.querySelectorAll('.tab-content');

botoesNavegacao.forEach(botao => {
    botao.addEventListener('click', (e) => {
        e.preventDefault();
        sons.click();
        mudarAba(botao.getAttribute('data-target'));
    });
});

function mudarAba(idAba) {
    conteudosAbas.forEach(aba => aba.classList.remove('active'));
    botoesNavegacao.forEach(btn => btn.classList.remove('active'));
    document.getElementById(idAba).classList.add('active');
    const botaoAtivo = document.querySelector(`[data-target="${idAba}"]`);
    if(botaoAtivo) botaoAtivo.classList.add('active');
}

// --- CONTROLE FINANCEIRO & METRICAS ---
function atualizarDados(ganhou, xpGanho = 10) {
    playerData.partidas++;
    if (ganhou) { playerData.vitorias++; playerData.xp += xpGanho; sons.win(); } 
    else { sons.fail(); }
    
    localStorage.setItem('gv_xp', playerData.xp);
    localStorage.setItem('gv_partidas', playerData.partidas);
    localStorage.setItem('gv_vitorias', playerData.vitorias);
    
    renderizarHUD();
    checarConquistas();
}

function renderizarHUD() {
    const nivel = Math.floor(playerData.xp / 60) + 1;
    document.getElementById('hud-level').innerHTML = `<i class="fa-solid fa-ranking-star"></i> Nível ${nivel}`;
    document.getElementById('hud-coins').innerHTML = `<i class="fa-solid fa-coins" style="color: #ffd700;"></i> ${playerData.xp} XP`;
    
    if(document.getElementById('st-partidas')) {
        document.getElementById('st-partidas').innerText = playerData.partidas;
        document.getElementById('st-vitorias').innerText = playerData.vitorias;
        document.getElementById('st-xp').innerText = playerData.xp;
        document.getElementById('rank-snake-val').innerText = playerData.highSnake + " pts";
    }
}

// --- CONFIGURAÇÃO DA JANELA MODAL ---
function abrirJogo(nomeJogo) {
    sons.click();
    document.getElementById('modal-game-title').innerText = nomeJogo.toUpperCase();
    document.getElementById('arcade-modal').style.display = 'flex';
    const arena = document.getElementById('game-arena');
    arena.innerHTML = '';

    // Desliga loops residuais do Snake se houver
    if(window.snakeInterval) clearInterval(window.snakeInterval);

    if (nomeJogo === 'Jogo da Velha') iniciarVelha(arena);
    else if (nomeJogo === 'Pedra, Papel e Tesoura') iniciarJokenpo(arena);
    else if (nomeJogo === 'Quiz') iniciarQuiz(arena);
    else if (nomeJogo === 'Forca') iniciarForca(arena);
    else if (nomeJogo === 'Snake') iniciarSnake(arena);
}

function fecharArcade() {
    sons.click();
    if(window.snakeInterval) clearInterval(window.snakeInterval);
    document.getElementById('arcade-modal').style.display = 'none';
    document.getElementById('game-arena').innerHTML = '';
}

// ==========================================
// 1. MÓDULO: JOGO DA VELHA
// ==========================================
function iniciarVelha(arena) {
    let tab = ['', '', '', '', '', '', '', '', ''];
    arena.innerHTML = `<div style="max-width:270px; margin:0 auto;">` + 
        tab.map((_, i) => `<div class="cell" id="c-${i}" onclick="jogarVelha(${i})"></div>`).join('') + 
        `</div><p id="velha-txt" class="text-green" style="margin-top:15px; font-family:'Orbitron';">Sua vez (X)</p>`;
    window.velhaTab = tab; window.velhaAtivo = true;
}
window.jogarVelha = function(i) {
    if(!window.velhaAtivo || window.velhaTab[i] !== '') return;
    sons.click();
    window.velhaTab[i] = 'X';
    document.getElementById(`c-${i}`).innerText = 'X';
    if(venceuVelha(window.velhaTab, 'X')) {
        document.getElementById('velha-txt').innerText = "Vitória! +20 XP";
        window.velhaAtivo = false; atualizarDados(true, 20); return;
    }
    if(!window.velhaTab.includes('')) { document.getElementById('velha-txt').innerText = "Empate!"; atualizarDados(false); return; }
    
    window.velhaAtivo = false;
    document.getElementById('velha-txt').innerText = "CPU processando...";
    setTimeout(() => {
        let livres = window.velhaTab.map((v, idx) => v === '' ? idx : null).filter(v => v !== null);
        let bot = livres[Math.floor(Math.random() * livres.length)];
        window.velhaTab[bot] = 'O';
        document.getElementById(`c-${bot}`).innerText = 'O';
        document.getElementById(`c-${bot}`).style.color = 'var(--roxo-neon)';
        if(venceuVelha(window.velhaTab, 'O')) {
            document.getElementById('velha-txt').innerText = "A máquina venceu!";
            document.getElementById('velha-txt').style.color = '#ff0055';
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

// ==========================================
// 2. MÓDULO: PEDRA, PAPEL E TESOURA
// ==========================================
function iniciarJokenpo(arena) {
    arena.innerHTML = `
        <div class="jokenpo-controls">
            <button class="btn-choice" onclick="jogarJKP('✊')">✊</button>
            <button class="btn-choice" onclick="jogarJKP('✋')">✋</button>
            <button class="btn-choice" onclick="jogarJKP('✌️')">✌️</button>
        </div>
        <p id="jkp-res" style="margin-top:25px; font-family:'Orbitron'; font-size:1rem; line-height:1.6;"></p>
    `;
}
window.jogarJKP = function(opcaoPlayer) {
    sons.click();
    const lista = ['✊', '✋', '✌️'];
    const opcaoCPU = lista[Math.floor(Math.random() * 3)];
    const res = document.getElementById('jkp-res');
    if(opcaoPlayer === opcaoCPU) { res.innerHTML = `Empate!<br>Ambos escolheram ${opcaoPlayer}`; atualizarDados(false); }
    else if ((opcaoPlayer==='✊'&&opcaoCPU==='✌️') || (opcaoPlayer==='✋'&&opcaoCPU==='✊') || (opcaoPlayer==='✌️'&&opcaoCPU==='✋')) {
        res.innerHTML = `Você: ${opcaoPlayer} vs CPU: ${opcaoCPU}<br><span class="text-green">Vitória Combatente! +10 XP</span>`;
        atualizarDados(true, 10);
    } else { res.innerHTML = `Você: ${opcaoPlayer} vs CPU: ${opcaoCPU}<br><span style="color:#ff0055">Derrota no Sistema!</span>`; atualizarDados(false); }
}

// ==========================================
// 3. MÓDULO: QUIZ GEEK (AMPLIADO - 5 PERGUNTAS)
// ==========================================
function iniciarQuiz(arena) {
    window.quizData = [
        { q: "Qual componente é o 'cérebro' do computador?", o: ["Memória RAM", "Processador (CPU)", "Placa de Vídeo", "SSD"], r: 1 },
        { q: "O que significa a sigla HTML?", o: ["HyperText Markup Language", "High Tech Multi Link", "Home Tool Market", "Hyperlinks Text Management"], r: 0 },
        { q: "Qual dessas empresas criou o sistema operacional Android?", o: ["Apple", "Microsoft", "Google", "Nokia"], r: 2 },
        { q: "No desenvolvimento web, para que serve o CSS?", o: ["Criar o banco de dados", "Definir a lógica do servidor", "Estilizar a estrutura visual", "Conectar a API externa"], r: 2 },
        { q: "Qual alternativa representa um dispositivo de armazenamento rápido?", o: ["Monitor", "Gabinete", "Filtro de linha", "SSD NVMe"], r: 3 }
    ];
    window.quizEtapa = 0;
    renderEtapaQuiz(arena);
}
function renderEtapaQuiz(arena) {
    if(window.quizEtapa >= window.quizData.length) {
        arena.innerHTML = `<p class="text-green" style="font-family:'Orbitron'; font-size:1.1rem;">GABARITOU! Quiz finalizado com sucesso!<br>+40 XP</p>`;
        atualizarDados(true, 40);
        if(!playerData.conquistas.includes('cq-quiz')) {
            playerData.conquistas.push('cq-quiz');
            localStorage.setItem('gv_conquistas', JSON.stringify(playerData.conquistas));
        }
        return;
    }
    let item = window.quizData[window.quizEtapa];
    arena.innerHTML = `<p style="margin-bottom:15px; font-weight:500; font-size:1rem; text-align:left;">${window.quizEtapa+1}. ${item.q}</p>` +
        item.o.map((opt, id) => `<button class="quiz-option" onclick="responderQuiz(${id})">${opt}</button>`).join('');
}
window.responderQuiz = function(idEscolhido) {
    if(idEscolhido === window.quizData[window.quizEtapa].r) {
        window.quizEtapa++;
        renderEtapaQuiz(document.getElementById('game-arena'));
    } else {
        document.getElementById('game-arena').innerHTML = `<p style="color:#ff0055; font-family:'Orbitron';">Circuito rompido! Resposta errada.<br>Fim de Jogo.</p>`;
        atualizarDados(false);
    }
}

// ==========================================
// 4. MÓDULO: JOGO DA FORCA (AMPLIADO - LISTA EXPANSIVA)
// ==========================================
function iniciarForca(arena) {
    const palavras = ["DEVELOPER", "TECLADO", "ARCADE", "MONITOR", "PIXEL", "JAVASCRIPT", "LINUX", "INTERNET", "ROTEADOR"];
    window.forcaPalavra = palavras[Math.floor(Math.random() * palavras.length)];
    window.forcaDescobertas = Array(window.forcaPalavra.length).fill("_");
    window.forcaErros = 0;
    renderForca();
}
function renderForca() {
    const arena = document.getElementById('game-arena');
    if(!window.forcaDescobertas.includes("_")) {
        arena.innerHTML = `<p class="text-green" style="font-family:'Orbitron'; font-size:1.2rem;">Palavra decodificada: ${window.forcaPalavra}!<br>+30 XP</p>`;
        atualizarDados(true, 30); return;
    }
    if(window.forcaErros >= 5) {
        arena.innerHTML = `<p style="color:#ff0055; font-family:'Orbitron'; font-size:1.2rem;">SISTEMA ENFORCADO!<br>A palavra correta era ${window.forcaPalavra}</p>`;
        atualizarDados(false); return;
    }
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    arena.innerHTML = `
        <p style="color:var(--texto-suave); font-size:0.9rem;">Integridade: ${5 - window.forcaErros} / 5 Tentativas</p>
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

// ==========================================
// 5. MÓDULO: SNAKE RETRO (CÓDIGO CANVAS REAL)
// ==========================================
function iniciarSnake(arena) {
    arena.innerHTML = `
        <canvas id="snakeCanvas" width="280" height="280" class="snake-canvas"></canvas>
        <p id="snake-score" style="font-family:'Orbitron'; font-size:1rem; color:var(--verde-neon)">Score: 0</p>
        <div class="snake-ctrls">
            <div></div><button class="btn-s" onclick="mudarDirSnake(0,-1)">▲</button><div></div>
            <button class="btn-s" onclick="mudarDirSnake(-1,0)">◀</button><button class="btn-s" onclick="mudarDirSnake(0,1)">▼</button><button class="btn-s" onclick="mudarDirSnake(1,0)">▶</button>
        </div>
    `;

    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    const box = 14; 
    
    let snake = [{x: 10 * box, y: 10 * box}];
    let dir = {x: box, y: 0};
    let food = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };
    let score = 0;

    window.mudarDirSnake = function(nx, ny) {
        sons.click();
        // Impede a cobra de voltar diretamente contra si mesma
        if((nx * box === -dir.x) || (ny * box === -dir.y)) return;
        dir = {x: nx * box, y: ny * box};
    };

    // Ouvinte físico de teclado para computadores
    window.onkeydown = function(e) {
        if(e.key === "ArrowUp") mudarDirSnake(0, -1);
        else if(e.key === "ArrowDown") mudarDirSnake(0, 1);
        else if(e.key === "ArrowLeft") mudarDirSnake(-1, 0);
        else if(e.key === "ArrowRight") mudarDirSnake(1, 0);
    };

    window.snakeInterval = setInterval(() => {
        // Calcula nova cabeça
        let head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};

        // Colisão com bordas ou autocolisão
        if(head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || snake.some(s => s.x === head.x && s.y === head.y)) {
            clearInterval(window.snakeInterval);
            document.getElementById('game-arena').innerHTML = `<p style="color:#ff0055; font-family:'Orbitron'; font-size:1.2rem;">CRASH! Cobra destruída.<br>Pontuação final: ${score}</p>`;
            
            // Grava Recorde
            if(score > playerData.highSnake) {
                playerData.highSnake = score;
                localStorage.setItem('gv_high_snake', score);
                if(score >= 50 && !playerData.conquistas.includes('cq-snake')) playerData.conquistas.push('cq-snake');
            }
            atualizarDados(score > 0, Math.floor(score / 2));
            return;
        }

        snake.unshift(head);

        // Cobra comeu o pixel
        if(head.x === food.x && head.y === food.y) {
            score += 10;
            document.getElementById('snake-score').innerText = "Score: " + score;
            bleep(750, 'sine', 0.05);
            food = {
                x: Math.floor(Math.random() * 20) * box,
                y: Math.floor(Math.random() * 20) * box
            };
        } else {
            snake.pop();
        }

        // Limpa e Redesenha no Canvas
        ctx.fillStyle = "#080512";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Desenha a comida (Verde Neon)
        ctx.fillStyle = "#39ff14";
        ctx.fillRect(food.x, food.y, box-1, box-1);

        // Desenha a cobra (Azul Neon)
        ctx.fillStyle = "#00f0ff";
        snake.forEach(s => ctx.fillRect(s.x, s.y, box-1, box-1));

    }, 130);
}

// ==========================================
// RECURSO EXTRA: SISTEMA DA LOJA COBRÁVEL
// ==========================================
window.comprarTema = function(cor, custo) {
    sons.click();
    const msg = document.getElementById('loja-msg');
    if(playerData.xp < custo) {
        msg.innerText = `Erro: Saldo de XP insuficiente (${playerData.xp}/${custo} XP necessários).`;
        msg.style.color = "#ff0055";
    } else {
        playerData.xp -= custo;
        localStorage.setItem('gv_xp', playerData.xp);
        document.documentElement.style.setProperty('--azul-neon', cor);
        document.querySelector('header').style.borderBottomColor = cor;
        msg.innerText = "Tema reconfigurado nos barramentos do sistema!";
        msg.style.color = "var(--verde-neon)";
        renderizarHUD();
    }
};

// --- MECÂNICA DE GERENCIAMENTO DE CONQUISTAS ---
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

// STARTUP
window.onload = () => {
    renderizarHUD();
    renderizarConquistas();
};